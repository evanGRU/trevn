import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
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
        avatar_url: profile.avatar_url,
        email: user.email,
        new_email: user.new_email,
    });
}

export async function PUT(req: Request) {
    const supabase = await createSupabaseServerClient();

    try {
        const body = await req.json();
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
