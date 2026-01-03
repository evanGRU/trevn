import { NextResponse } from "next/server";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export async function DELETE(req: Request) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatarId, avatarName } = (await req.json()) as {
        avatarId?: string;
        avatarName?: string;
    };

    if (!avatarId || !avatarName) {
        return NextResponse.json(
            { error: "missing_parameters" },
            { status: 400 }
        );
    }

    const { error: storageError } = await supabase.storage
        .from("avatars")
        .remove([`users/${avatarName}`]);

    if (storageError) {
        return NextResponse.json(
            { error: storageError.message },
            { status: 500 }
        );
    }

    const { error: deleteError } = await supabase
        .from("avatars")
        .delete()
        .eq("id", avatarId);

    if (deleteError) {
        return NextResponse.json(
            { error: deleteError.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true });
}
