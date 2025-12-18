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
