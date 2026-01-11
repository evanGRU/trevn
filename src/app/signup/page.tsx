import AuthForm from "@/components/webPage/auth/AuthWrapper";
import {Suspense} from "react";

export default function SignupPage() {
    return (
        <Suspense fallback={null}>
            <AuthForm type="signup" />
        </Suspense>
    );
}