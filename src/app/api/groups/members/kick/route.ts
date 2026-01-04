import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { groupId, userIdToKick } = await req.json();

    if (!groupId || !userIdToKick) {
        return NextResponse.json(
            { error: "missing_parameters" },
            { status: 400 }
        );
    }

    const { error } = await supabase.rpc("kick_group_member", {
        p_group_id: groupId,
        p_user_id: userIdToKick,
    });

    if (error) {
        console.error(error.message);

        const statusMap: Record<string, number> = {
            not_authenticated: 401,
            forbidden: 403,
            group_not_found: 404,
            member_not_found: 404,
            cannot_kick_owner: 400,
        };

        return NextResponse.json(
            { error: error.message },
            { status: statusMap[error.message] ?? 500 }
        );
    }

    return NextResponse.json({ success: true });
}
