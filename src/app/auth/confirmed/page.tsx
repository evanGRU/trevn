import type {Metadata} from "next";
import EmailConfirmedPage from "@/app/auth/confirmed/EmailConfirmedClient";

export const metadata: Metadata = {
    title: "Compte confirmé – Trevn",
    robots: {
        index: false,
        follow: false,
    },
}

export default async function LoginPage() {
    return <EmailConfirmedPage></EmailConfirmedPage>;
}
