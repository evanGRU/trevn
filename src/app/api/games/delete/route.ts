import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {assertGroupRule} from "@/utils/helpers/assertGroupRules";

type Body = {
    groupId: string
    gameId: number
}

export async function DELETE(req: Request) {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { groupId, gameId }: Body = await req.json()
    if (!groupId || !gameId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { data: memberCheck, error: memberError } = await supabase
        .from('groups_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (memberError) {
        return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    if (!memberCheck) {
        return NextResponse.json({ error: 'not_member' }, { status: 403 });
    }

    const ruleCheck = await assertGroupRule(
        supabase,
        groupId,
        "delete_games"
    );

    if (!ruleCheck.ok) {
        return ruleCheck.response;
    }

    const { error: deleteError } = await supabase
        .from('groups_games')
        .delete()
        .eq('group_id', groupId)
        .eq('game_id', gameId);

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
