import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { groupId } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select(`
            id,
            avatar: avatars!avatar_id (id, is_custom, name)
        `)
        .eq("id", groupId)
        .maybeSingle();

    if (groupError || !group) {
        return NextResponse.json({ error: "group_not_found" }, { status: 404 });
    }

    const avatar: any = group?.avatar;
    if (avatar.is_custom && avatar.name) {
        const { error: storageError } = await supabase.storage
            .from("avatars")
            .remove([`groups/${avatar.name}`]);

        if (storageError) {
            console.error("Storage delete error:", storageError);
            return NextResponse.json(
                { error: "avatar_delete_failed" },
                { status: 500 }
            );
        }
    }

    const { error: rpcError } = await supabase.rpc("delete_group", {
        p_group_id: groupId,
    });

    if (rpcError) {
        console.error("RPC delete_group error:", rpcError);
        return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
