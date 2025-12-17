import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("avatars")
        .select("id, type, name")
        .eq("type", "groups")
        .eq("is_custom", false);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data ?? []);
}
