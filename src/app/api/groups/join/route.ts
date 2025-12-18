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
            { error: "Code invalide ou groupe introuvable." },
            { status: 400 }
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
