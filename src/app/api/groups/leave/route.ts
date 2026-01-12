import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { groupId } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: membership, error: membershipError } = await supabase
        .from("groups_members")
        .select("*")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) {
        console.error("Erreur Supabase :", membershipError);

        return NextResponse.json({ error: "error"}, { status: 500 });
    }

    if (!membership) {
        return NextResponse.json(
            { error: "not_member" },
            { status: 400 }
        );
    }

    const { error: membershipDeleteError } = await supabase
        .from("groups_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

    if (membershipDeleteError) {
        console.error("Erreur Supabase :", membershipDeleteError);

        return NextResponse.json({ error: "error"}, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
