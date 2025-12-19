import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

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
          description,
          avatar:avatars!avatar_id (
            id,
            name,
            type
          ),
          members:groups_members!group_id (
            profiles ( 
              username,
              avatar_url
            )
          )
        `)
        .eq('id', groupId)
        .single();

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    const avatar = Array.isArray(data.avatar)
        ? data.avatar[0] ?? null
        : data.avatar;

    return NextResponse.json({
        ...data,
        avatar,
    });
}
