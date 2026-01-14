import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {isEmail} from "@/utils/globalFunctions";

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();

    // Always return success to avoid information leaks
    try {
        const { email, password } = await req.json();

        if (password) {
            const {data} = await supabase.auth.getSession();
            if (!data.session) {
                return NextResponse.json({ error: "auth_missing" });
            }

            const { error: updateError } = await supabase.auth.updateUser({password})
            if (updateError) {
                switch (updateError.code) {
                    case 'weak_password':
                        return NextResponse.json({ error: 'weak_password' }, { status: 400 });
                    case 'same_password':
                        return NextResponse.json({ error: 'same_password' }, { status: 400 });
                    default:
                        return NextResponse.json({ error: 'unknown_error' }, { status: 500 });
                }
            }

            return NextResponse.json({ success: true });
        }

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
