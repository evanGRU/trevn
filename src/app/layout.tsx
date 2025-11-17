import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "../styles/globals.scss";
import "../styles/theme.scss";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['900'],
    variable: '--font-poppins',
    display: 'swap'
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['200', '400', '600'],
    variable: '--font-inter',
    display: 'swap'
})

export const metadata: Metadata = {
  title: "Trevn - Choisissez ensemble à quoi jouer ce soir.",
  description: "Créez votre propre liste de jeux et notez les avec vos amis !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
