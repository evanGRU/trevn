import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { groupId, gameId } = await req.json();

        if (!groupId || !gameId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const { error } = await supabase
            .from('groups_games')
            .insert({
                group_id: groupId,
                game_id: gameId,
                added_by: user.id,
            });

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'game_already_added' },
                    { status: 400 }
                );
            }

            return NextResponse.json({ error: 'Failed to add game' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
