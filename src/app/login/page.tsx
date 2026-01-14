import AuthForm from "@/components/webPage/auth/AuthWrapper";
import {Suspense} from "react";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Connexion - Trevn",
    description: "Connecte-toi à ton compte Trevn pour accéder à tes groupes."
};

export default async function LoginPage() {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser()
    if (user) redirect('/groups');

    return (
        <Suspense fallback={null}>
            <AuthForm type="login" />
        </Suspense>
    );
}
