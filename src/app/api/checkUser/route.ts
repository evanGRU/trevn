import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email manquant" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        const exists = data.users.some((user) => user.email === email);

        return NextResponse.json({ exists });
    } catch (err) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
