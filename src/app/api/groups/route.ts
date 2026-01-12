import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

// Get Group
export async function GET() {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          avatar:avatars!avatar_id (
            id,
            name,
            type
          ),
          groups_members!inner (
            user_id
          )
        `)
        .eq('groups_members.user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    const groups = (data ?? []).map((group) => ({
        ...group,
        avatar: Array.isArray(group?.avatar)
            ? group?.avatar[0] ?? null
            : group?.avatar,
    }));

    return NextResponse.json(groups);
}


// Create Group
export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const formData = await req.formData();

    const name = formData.get('name')?.toString();
    const inviteCode = formData.get('inviteCode')?.toString();
    const selectedAvatar = formData.get('avatarId')?.toString();
    const imageFile = formData.get('image') as File | null;

    if (!name || !inviteCode) {
        return NextResponse.json(
            { error: 'Invalid data' },
            { status: 400 }
        );
    }

    let avatarId: string | null = selectedAvatar ?? null;

    try {
        if (imageFile) {
            const ext = imageFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${ext}`;

            await supabase.storage
                .from('avatars/groups')
                .upload(fileName, imageFile, { upsert: true });

            const { data } = await supabase
                .from('avatars')
                .insert({
                    type: 'groups',
                    name: fileName,
                    is_custom: true,
                    created_by: user.id,
                })
                .select('id')
                .single();

            avatarId = data?.id;
        }

        // Create group, members and link avatar
        const { data: groupId, error } = await supabase.rpc(
            'create_group_with_avatar',
            {
                p_name: name,
                p_invite_code: inviteCode,
                p_avatar_id: avatarId,
            }
        );

        if (error) {
            console.error(error);
            return NextResponse.json({ error });
        }

        return NextResponse.json({ success: true, groupId });
    } catch (err) {
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}


// Update Group
export async function PUT(req: Request) {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const groupId = formData.get("groupId")?.toString();
    if (!groupId) {
        return NextResponse.json({ error: "missing_group" }, { status: 400 });
    }

    const { data: group } = await supabase
        .from("groups")
        .select(`
            id, 
            groups_members!id (
                user_id
            )
        `)
        .eq("id", groupId)
        .eq("groups_members.user_id", user.id)
        .single();

    if (!group) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const accessMode = formData.get('accessMode')?.toString();

    const avatarFile = formData.get("avatarFile") as File | null;
    const selectedAvatar = formData.get('avatarId')?.toString();

    try {
        /* SETUP UPDATED VALUES */
        const groupUpdates: Record<string, unknown> = {};

        if (name !== undefined) {
            groupUpdates.name = name;
        }

        if (description !== undefined) {
            groupUpdates.description = description;
        }

        if (accessMode !== undefined) {
            groupUpdates.access_mode = accessMode;
        }


        /* MANAGE AVATAR */
        if (avatarFile || selectedAvatar) {
            let avatarId: string | null = selectedAvatar ?? null;

            if (avatarFile) {
                const ext = avatarFile.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars/groups")
                    .upload(fileName, avatarFile, { upsert: true });

                if (uploadError) {
                    console.error(uploadError);
                    return NextResponse.json(
                        { error: "avatar_upload_failed" },
                        { status: 500 }
                    );
                }

                const { data: avatar, error: avatarError } = await supabase
                    .from('avatars')
                    .insert({
                        type: 'groups',
                        name: fileName,
                        is_custom: true,
                        created_by: user.id,
                    })
                    .select('id')
                    .single();

                if (avatarError || !avatar) {
                    console.error(avatarError);
                    return NextResponse.json(
                        { error: "avatar_create_failed" },
                        { status: 500 }
                    );
                }

                avatarId = avatar.id;
            }

            if (selectedAvatar) {
                await supabase
                    .from("avatars")
                    .update({ created_at: new Date() })
                    .eq("id", avatarId);
            }

            groupUpdates.avatar_id = avatarId;
        }

        /* EXIT IF NO UPDATES */
        if (Object.keys(groupUpdates).length === 0) {
            return NextResponse.json({ success: true });
        }

        /* UPDATE GROUP */
        const { error: updateError } = await supabase
            .from("groups")
            .update(groupUpdates)
            .eq("id", groupId);

        if (updateError) {
            console.error(updateError);
            return NextResponse.json(
                { error: "group_update_failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

