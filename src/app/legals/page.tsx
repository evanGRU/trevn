import type {Metadata} from "next";
import LegalsHeader from "@/components/webPage/legals/legalsHeader/legalsHeader";
import styles from './page.module.scss';
import React from "react";
import BackButton from "@/components/webPage/legals/backButton/backButton";
import LastUpdateContainer from "@/components/webPage/legals/lastUpdateContainer/lastUpdateContainer";
import LegalSection from "@/components/webPage/legals/legalSection/legalSection";
import Link from "next/link";
import LegalsFooter from "@/components/webPage/creditsFooter/creditsFooter";

export const metadata: Metadata = {
    title: "Mentions légales",
    robots: {
        index: false,
        follow: true,
    },
}

export default async function LegalsPage() {
    return (
        <div className={styles.legalsPage} id={"legalsPage"}>
            <LegalsHeader/>

            <div className={styles.headerTitle}>
                <BackButton/>
                <h1>Mentions légales</h1>
                <LastUpdateContainer lastUpdate={"20 janvier 2026"}/>
            </div>

            <main className={styles.contentList}>
                <LegalSection number={1} title={"éditeur du site"}>
                    <p>
                        Le site Trevn est édité par Evan GRUCHOT. <br/>
                        Le responsable de la publication est l’éditeur du site. <br/>
                        CONTACT : contact@trevn.app
                    </p>
                </LegalSection>

                <LegalSection number={2} title={"Hébergement"}>
                    <p>
                        Le site est hébergé par : <br/>
                        Vercel Inc. <br/>
                        340 S Lemon Ave #4133 <br/>
                        Walnut, CA 91789 <br/>
                        États-Unis <br/>
                        Site web : <Link href={"https://vercel.com"} className={styles.link}>https://vercel.com</Link>
                    </p>
                </LegalSection>

                <LegalSection number={3} title={"Propriété intellectuelle"}>
                    <p>L’ensemble des contenus présents sur le site Trevn, incluant notamment les textes, images, graphismes, logos, icônes, sons, vidéos, logiciels et code source, est protégé par le droit d’auteur et les lois relatives à la propriété intellectuelle.</p>
                    <p>Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l’éditeur.</p>
                </LegalSection>

                <LegalSection number={4} title={"Responsabilité"}>
                    <p>
                        L’éditeur s’efforce de fournir sur le site Trevn des informations aussi précises que possible. <br/>
                        Toutefois, il ne saurait être tenu responsable des omissions, des inexactitudes ou des carences dans la mise à jour, qu’elles soient de son fait ou du fait de tiers partenaires.
                    </p>
                    <p>
                        L’utilisation du site se fait sous la seule responsabilité de l’utilisateur. <br/>
                        L’éditeur ne pourra être tenu responsable de dommages directs ou indirects résultant de l’accès ou de l’utilisation du site.
                    </p>
                </LegalSection>

                <LegalSection number={5} title={"Données personnelles et conditions d’utilisation"}>
                    <p>L’utilisation du site Trevn est régie par les Conditions Générales d’Utilisation (CGU), qui définissent les règles d’accès et d’utilisation du service.</p>
                    <p>Les modalités de collecte et de traitement des données personnelles sont décrites dans la Politique de confidentialité, conformément à la réglementation en vigueur.</p>
                </LegalSection>
            </main>

            <div className={styles.linksContainer}>
                <h3>Liens utiles</h3>
                <ul>
                    <li><Link href={"/privacy"}>Politique de confidentialité</Link></li>
                    <li><Link href={"/cgu"}>Conditions Générales d&apos;Utilisation (CGU)</Link></li>
                </ul>
            </div>

            <footer>
                <Link href={"#legalsPage"} className={styles.topPageButton}>
                    <div className={styles.iconContainer}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"></path>
                        </svg>
                    </div>

                    <p>Retourner en haut de la page</p>
                </Link>
                <LegalsFooter/>
            </footer>
        </div>
    );
}
