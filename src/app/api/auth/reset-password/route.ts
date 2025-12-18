import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {isEmail} from "@/utils/globalFunctions";

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();

    // Always return success to avoid information leaks
    try {
        const { email } = await req.json();

        if (!email || !isEmail(email)) {
            return NextResponse.json({ success: true });
        }

        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: true });
    }
}
