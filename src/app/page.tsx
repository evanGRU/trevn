import type {Metadata} from "next";
import WebPageClient from "@/app/WebpageClient";

export const metadata: Metadata = {
    title: "Trevn - Choisissez ensemble à quoi jouer ce soir",
    description: "La plateforme pour organiser vos soirées gaming, proposer des jeux et voter entre potes.",

    openGraph: {
        title: 'Trevn - Choisissez ensemble à quoi jouer ce soir',
        description:
            'La plateforme pour organiser vos soirées gaming, proposer des jeux et voter entre potes.',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
        siteName: 'Trevn',
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/og_image.png`,
                width: 1200,
                height: 630,
                alt: 'Trevn – Planifiez vos soirées entre potes',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
};

export default function WebPage() {
    return <WebPageClient></WebPageClient>
}
