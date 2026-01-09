import {createSupabaseServerClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { groupId, newCode } = await req.json();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    if (!groupId || !newCode) {
        return NextResponse.json(
            { error: 'missing_required_field' },
            { status: 401 }
        );
    }

    const { error: newGroupError } = await supabase
        .from("groups")
        .update({invite_code: newCode})
        .eq("id", groupId)
        .single();

    if (newGroupError) {
        console.error("Update failed:", newGroupError);
        switch (newGroupError.code) {
            case "23505":
                return NextResponse.json({ error: "invite_code_already_used" }, { status: 409 });
            case "42501":
                return NextResponse.json({ error: "forbidden" }, { status: 403 });
            default:
                return NextResponse.json({ error: "update_failed" }, { status: 500 });
        }
    }

    return Response.json({ success: true });
}
