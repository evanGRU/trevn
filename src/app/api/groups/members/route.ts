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

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("created_by")
        .eq("id", groupId)
        .single();

    if (groupError) {
        console.error(groupError);
        return NextResponse.json(
            { error: groupError.message },
            { status: 500 }
        );
    }

    const { data, error } = await supabase
        .from("groups_members")
        .select(`
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
        roles: group.created_by === user.user.id ? "owner" : ""
    }));

    return NextResponse.json(members);
}
