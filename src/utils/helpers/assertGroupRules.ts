import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type RuleCode =
    | "add_games"
    | "delete_games"
    | "like_games";

export async function assertGroupRule(
    supabase: SupabaseClient,
    groupId: string,
    ruleCode: RuleCode
) {
    const { data, error } = await supabase
        .from("groups_rules")
        .select("value")
        .eq("group_id", groupId)
        .eq("code", ruleCode)
        .single();

    if (error) {
        console.error(error);
        return {
            ok: false,
            response: NextResponse.json(
                { error: "rule_not_found" },
                { status: 403 }
            ),
        };
    }

    if (!data.value) {
        return {
            ok: false,
            response: NextResponse.json(
                { error: "cant_" + ruleCode },
                { status: 403 }
            ),
        };
    }

    return { ok: true };
}
