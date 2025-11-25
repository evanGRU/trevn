import {createClient} from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { code } = await req.json();

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
        return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("invite_code", code)
        .single();

    if (!group || groupError) {
        return Response.json(
            { error: "Code invalide ou groupe introuvable" },
            { status: 400 }
        );
    }

    const { error: joinError } = await supabase
        .from("groups_members")
        .insert({
            group_id: group.id,
            user_id: auth.user.id,
        });

    if (joinError) {
        return Response.json({ error: joinError.message }, { status: 400 });
    }

    return Response.json({ success: true, groupId: group.id });
}
