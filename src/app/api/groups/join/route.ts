import {createSupabaseServerClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { code } = await req.json();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("invite_code", code)
        .single();

    if (!group || groupError) {
        return Response.json(
            { error: "invalid_code" },
            { status: 400 }
        );
    }

    if (group.access_mode === "closed") {
        return Response.json(
            { error: "group_close" },
            { status: 401 }
        );
    }

    const { data: membership, error: memberError } = await supabase
        .from("groups_members")
        .select("id")
        .eq("group_id", group.id)
        .eq("user_id", user.id)
        .maybeSingle();

    if (memberError) {
        return NextResponse.json(
            { error: memberError.message },
            { status: 500 }
        );
    }

    if (membership) {
        return NextResponse.json(
            { error: "already_member" },
            { status: 409 }
        );
    }

    const { error: joinError } = await supabase
        .from("groups_members")
        .insert({
            group_id: group.id,
            user_id: user.id,
        });

    if (joinError) {
        return Response.json({ error: joinError.message }, { status: 400 });
    }

    return Response.json({ success: true, groupId: group.id });
}
