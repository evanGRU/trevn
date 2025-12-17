import { NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();

    try {
        const body = await req.json();
        const { mode, email, password, username } = body;

        if (!email || !password || (mode === 'signup' && !username)) {
            return NextResponse.json({ error: 'missingFields' }, { status: 400 });
        }

        // LOGIN
        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                switch (error.code) {
                    case 'invalid_credentials':
                        return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
                    case 'email_not_confirmed':
                        return NextResponse.json({ error: 'email_not_confirmed' }, { status: 403 });
                    default:
                        return NextResponse.json({ error: 'unknown_error' }, { status: 500 });
                }
            }

            return NextResponse.json({ success: true });
        }

        // SIGNUP
        if (mode === 'signup') {
            if (password.length < 6) {
                return NextResponse.json({ error: 'weakPassword' }, { status: 400 });
            }

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                },
            });

            if (error) {
                switch (error.code) {
                    case 'email_address_invalid':
                        return NextResponse.json({ error: 'email_address_invalid' }, { status: 400 });
                    default:
                        return NextResponse.json({ error: 'unknown_error' }, { status: 500 });
                }
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'invalid_mode' }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }
}
