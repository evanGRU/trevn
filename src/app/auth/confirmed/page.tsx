import type {Metadata} from "next";
import EmailConfirmedPageClient from "@/app/auth/confirmed/EmailConfirmedClient";

export const metadata: Metadata = {
    title: "Compte confirmé – Trevn",
    robots: {
        index: false,
        follow: false,
    },
}

export default async function EmailConfirmedPage() {
    return <EmailConfirmedPageClient></EmailConfirmedPageClient>;
}
