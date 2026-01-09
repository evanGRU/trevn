import { NextResponse } from "next/server";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export async function PUT(req: Request) {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { groupId, rules } = await req.json();
    if (!groupId || !Array.isArray(rules) || rules.length === 0) {
        return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    console.log(groupId, rules);


    const { data: membership } = await supabase
        .from("groups_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

    if (!membership) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    if (membership.role !== "owner") {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }


    const ruleIds = rules.map(r => r.id);

    const { data: dbRules } = await supabase
        .from("groups_rules")
        .select("id")
        .eq("group_id", groupId)
        .in("id", ruleIds);

    if (!dbRules || dbRules.length !== ruleIds.length) {
        return NextResponse.json({ error: "invalid_rules" }, { status: 400 });
    }


    const updates = rules.map(rule =>
        supabase
            .from("groups_rules")
            .update({ value: rule.value })
            .eq("id", rule.id)
            .eq("group_id", groupId)
    );

    const results = await Promise.all(updates);

    const hasError = results.some(r => r.error);
    if (hasError) {
        console.error(results);
        return NextResponse.json({ error: "update_failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
