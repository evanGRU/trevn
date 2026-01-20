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
    title: "Trevn",
    icons: {
        icon: '/favicon.svg',
        shortcut: "/favicon.ico",
    },
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="fr" className={`${poppins.variable} ${quinn.variable}`}>
            <body>
                {children}
                <Toaster
                    position="top-center"
                    containerStyle={{
                        zIndex: 9999999
                    }}
                />
            </body>
        </html>
    );
}
