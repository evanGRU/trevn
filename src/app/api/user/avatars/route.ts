import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("avatars")
        .select("id, type, name")
        .eq("type", "users")
        .eq("created_by", user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data ?? []);
}
