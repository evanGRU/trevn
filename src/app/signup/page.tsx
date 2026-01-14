import AuthForm from "@/components/webPage/auth/AuthWrapper";
import {Suspense} from "react";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

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