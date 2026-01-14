import AuthForm from "@/components/webPage/auth/AuthWrapper";
import {Suspense} from "react";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Créer un compte - Trevn",
    description: "Crée ton compte Trevn et commence à organiser ou rejoindre des groupes en quelques clics."
};

export default async function SignupPage() {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser()
    if (user) redirect('/groups');

    return (
        <Suspense fallback={null}>
            <AuthForm type="signup" />
        </Suspense>
    );
}