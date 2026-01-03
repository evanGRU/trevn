import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

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
