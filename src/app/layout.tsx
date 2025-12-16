import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.scss";
import "../styles/theme.scss";
import localFont from "next/font/local";
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
    display: 'swap'
})

const quinn = localFont({
    src: "../fonts/quinn.ttf",
    variable: "--font-quinn"
})

export const metadata: Metadata = {
    title: "Trevn - Choisissez ensemble à quoi jouer ce soir",
    description: "La plateforme pour organiser vos soirées gaming, proposer des jeux et voter entre potes",
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="fr" className={`${poppins.variable} ${quinn.variable}`}>
            <body>
                {children}
                <Toaster position="top-center" />
            </body>
        </html>
    );
}
