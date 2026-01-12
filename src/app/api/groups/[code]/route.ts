import {createSupabaseServerClient} from "@/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    const supabase = await createSupabaseServerClient();
    const { code } = await params;

    const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          avatar:avatars!avatar_id (
            id,
            name,
            type
          )
        `)
        .eq("invite_code", code)
        .single();

    if (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    const group = {
        ...data,
        avatar: Array.isArray(data?.avatar)
            ? data?.avatar[0] ?? null
            : data?.avatar,
    };

    return NextResponse.json(group);
}