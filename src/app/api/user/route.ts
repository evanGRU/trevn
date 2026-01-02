import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import {UpdateUserPayload} from "@/utils/types";

export async function GET() {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(`
            id, 
            username, 
            avatar:avatars!profiles_avatar_id_fkey (
              id,
              name,
              type
            )
        `)
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return NextResponse.json(
            { error: "Profile not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({
        id: profile.id,
        username: profile.username,
        avatar: profile.avatar,
        email: user.email,
        new_email: user.new_email,
    });
}

export async function PUT(req: Request) {
    const supabase = await createSupabaseServerClient();

    try {
        let body: UpdateUserPayload = {};
        let avatarFile: File | null = null;
        let selectedAvatar: string | undefined | null = null;

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            body = await req.json();
        } else if (contentType.includes("form-data")) {
            const formData = await req.formData();
            avatarFile = formData.get("avatarFile") as File | null;
            selectedAvatar = formData.get('avatarId')?.toString();
        } else {
            return new Response("Unsupported content type", { status: 400 });
        }

        const { username, email, password } = body;


        const {data: { user }} = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user.id;

        let emailConfirmationSent = false;
        let passwordHasChanged = false;

        // Update email and/or password
        if (email || password) {
            const updateAuthData: Record<string, string> = {};
            if (email) updateAuthData.email = email;
            if (password) updateAuthData.password = password;

            const { error: authError } = await supabase.auth.updateUser(updateAuthData);
            if (authError) {
                console.error(authError);
                return NextResponse.json({ error: 'update_auth_failed' }, { status: 500 });
            }

            if (email) {
                emailConfirmationSent = true;
            }
            if (password) {
                passwordHasChanged = true;
            }
        }

        // Update username
        if (username) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile !== null && profile.username !== username) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ username })
                    .eq('id', userId);

                if (profileError) {
                    console.error(profileError);

                    // Rollback changes
                    if (email || password) {
                        const rollbackData: Record<string, string | undefined> = {};
                        if (email) rollbackData.email = user.email;
                        await supabase.auth.admin.updateUserById(userId, rollbackData);
                    }

                    return NextResponse.json({ error: 'update_username_failed' }, { status: 500 });
                }
            }
        }

        if (avatarFile || selectedAvatar) {
            let avatarId: string | null = selectedAvatar ?? null;

            if (avatarFile) {
                const ext = avatarFile.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${ext}`;

                await supabase.storage
                    .from('avatars/users')
                    .upload(fileName, avatarFile, { upsert: true });

                const { data: avatar, error: avatarError } = await supabase
                    .from('avatars')
                    .insert({
                        type: 'users',
                        name: fileName,
                        is_custom: true,
                        created_by: user.id,
                    })
                    .select('id')
                    .single();

                if (avatarError) {
                    console.error(avatarError);
                    return NextResponse.json({ error: 'update_avatar_failed' }, { status: 500 });
                }

                avatarId = avatar.id;
            }

            if (selectedAvatar) {
                await supabase
                    .from("avatars")
                    .update({ created_at: new Date() })
                    .eq("id", avatarId);
            }

            await supabase
                .from("profiles")
                .update({ avatar_id: avatarId })
                .eq("id", userId);

            return NextResponse.json({
                success: true
            });
        }

        return NextResponse.json({
            success: true,
            emailConfirmationSent,
            passwordHasChanged
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
