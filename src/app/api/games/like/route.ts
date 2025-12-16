import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

type Body = {
    groupId: string
    gameId: number
}

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient()

    const {data: { user }} = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const { groupId, gameId }: Body = await req.json()
    if (!groupId || !gameId) {
        return NextResponse.json(
            { error: 'Missing params' },
            { status: 400 }
        )
    }

    const { data: existingLike, error: selectError } = await supabase
        .from('groups_games_likes')
        .select('id')
        .eq('group_id', groupId)
        .eq('game_id', gameId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (selectError) {
        return NextResponse.json(
            { error: selectError.message },
            { status: 500 }
        )
    }

    if (existingLike) {
        // UNLIKE
        const { error } = await supabase
            .from('groups_games_likes')
            .delete()
            .eq('id', existingLike.id)

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ liked: false })
    } else {
        // LIKE
        const { error } = await supabase
            .from('groups_games_likes')
            .insert({
                group_id: groupId,
                game_id: gameId,
                user_id: user.id,
            })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ liked: true })
    }
}
