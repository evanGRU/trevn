import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
        return NextResponse.json(
            { error: "missing_parameters" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("groups_members")
        .select(`
            role,
            user:profiles!user_id (
                id,
                username,
                avatar:avatars!avatar_id (
                  id,
                  name,
                  type
                )
            )
        `)
        .eq("group_id", groupId);

    if (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    const members = (data).map((user: any) => ({
        ...user.user,
        role: user.role
    }));

    return NextResponse.json(members);
}
