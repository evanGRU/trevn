import AuthForm from "@/components/webPage/auth/AuthWrapper";
import {Suspense} from "react";

export default function LoginPage() {

    return (
        <Suspense fallback={null}>
            <AuthForm type="login" />
        </Suspense>
    );
}
