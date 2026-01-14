import type {Metadata} from "next";
import ResetPasswordPage from "@/app/reset-password/ResetPasswordClient";

export const metadata: Metadata = {
    title: "Réinitialisation du mot de passe – Trevn",
    robots: {
        index: false,
        follow: false,
    },
}

export default async function LoginPage() {
    return <ResetPasswordPage></ResetPasswordPage>;
}
