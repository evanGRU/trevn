import type {Metadata} from "next";
import styles from './page.module.scss';
import React from "react";
import BackButton from "@/components/webPage/legals/backButton/backButton";
import LastUpdateContainer from "@/components/webPage/legals/lastUpdateContainer/lastUpdateContainer";
import LegalSection from "@/components/webPage/legals/legalSection/legalSection";
import Link from "next/link";
import LegalsFooter from "@/components/webPage/creditsFooter/creditsFooter";
import MobileHeader from "@/components/webPage/mobileHeader/mobileHeader";

export const metadata: Metadata = {
    title: "Politique de confidentialité",
    robots: {
        index: false,
        follow: true,
    },
}

export default async function PrivacyPage() {
    return (
        <div className={styles.privacyPage} id={"privacyPage"}>
            <div className={styles.headerContainer}>
                <MobileHeader homeButton={true}/>
            </div>

            <div className={styles.headerTitle}>
                <BackButton/>
                <h1>Politique de confidentialité</h1>
                <LastUpdateContainer lastUpdate={"20 janvier 2026"}/>
            </div>

            <main className={styles.contentList}>
                <LegalSection number={1} title={"Introduction"}>
                    <p>La présente Politique de confidentialité explique comment le site et l’application Trevn (ci-après « le Service ») collecte, utilise et protège les données personnelles de ses utilisateurs.</p>
                    <p>En utilisant le Service, vous acceptez les pratiques décrites dans cette Politique.</p>
                </LegalSection>

                <LegalSection number={2} title={"Responsable du traitement des données"}>
                    <p>
                        Le responsable du traitement des données est l’éditeur du site Evan GRUCHOT. <br/>
                        CONTACT : contact@trevn.app
                    </p>
                </LegalSection>

                <LegalSection number={3} title={"Données collectées"}>
                    <p>Trevn peut collecter les données suivantes :</p>
                    <ul className={styles.list}>
                        <p className={styles.listTitle}>1. Données fournies volontairement par l’utilisateur</p>
                        <li><p>- Nom d’utilisateur / pseudo</p></li>
                        <li><p>- Adresse</p></li>
                        <li><p>- Contenus publiés (likes, images ajoutées)</p></li>
                    </ul>
                    <ul className={styles.list}>
                        <p className={styles.listTitle}>2. Technologies de mesure d’audience</p>
                        <li>
                            <p>- Utilisation d’outils de mesure d’audience sans cookies et sans suivi individuel</p>
                        </li>
                    </ul>
                    <p>
                        Le Service ne collecte aucune donnée technique permettant
                        l’identification personnelle des utilisateurs, en dehors des données
                        strictement nécessaires à son fonctionnement et à des statistiques anonymes.
                    </p>
                </LegalSection>

                <LegalSection number={4} title={"Mesure d’audience"}>
                    <p>
                        Le Service utilise Vercel Analytics afin de mesurer la fréquentation
                        et d’améliorer l’expérience utilisateur.
                    </p>
                    <p>
                        Vercel Analytics ne dépose aucun cookie et ne collecte aucune donnée personnelle identifiable. <br/>
                        Les statistiques collectées sont anonymes et utilisées uniquement à des fins d’amélioration du Service.
                    </p>
                </LegalSection>

                <LegalSection number={5} title={"Finalités de la collecte"}>
                    <ul className={styles.list}>
                        <p className={styles.listTitle}>Les données sont utilisées pour :</p>
                        <li><p>- Fournir et maintenir le Service</p></li>
                        <li><p>- Gérer les comptes utilisateurs et la sécurité</p></li>
                        <li><p>- Personnaliser l’expérience utilisateur</p></li>
                        <li><p>- Prévenir et détecter les abus ou comportements illicites</p></li>
                        <li><p>- Améliorer le Service grâce à des statistiques anonymes</p></li>
                    </ul>
                </LegalSection>

                <LegalSection number={6} title={"Partage des données"}>
                    <p>
                        Trevn ne vend pas vos données. <br/>
                        Les données peuvent être partagées uniquement avec des prestataires techniques (ex. Vercel pour l’hébergement, services d’analytics) strictement pour le fonctionnement du Service. <br/>
                        Aucun autre partage n’a lieu sans votre consentement.
                    </p>
                </LegalSection>

                <LegalSection number={7} title={"Durée de conservation"}>
                    <p>Les données de compte et les contenus publiés sont conservés tant que le compte existe.</p>
                </LegalSection>

                <LegalSection number={8} title={"Sécurité des données"}>
                    <ul className={styles.list}>
                        <p className={styles.listTitle}>Trevn met en place des mesures techniques et organisationnelles pour protéger vos données contre :</p>
                        <li><p>- La perte, l’altération ou la divulgation non autorisée</p></li>
                        <li><p>- L’accès non autorisé aux systèmes du Service</p></li>
                    </ul>
                    <p>Remarque : aucune transmission de données sur Internet n’est totalement sécurisée, mais l’éditeur prend toutes les précautions raisonnables.</p>
                </LegalSection>

                <LegalSection number={9} title={"Droits des utilisateurs"}>
                    <ul className={styles.list}>
                        <p className={styles.listTitle}>Conformément au RGPD, vous pouvez :</p>
                        <li><p>- Accéder à vos données</p></li>
                        <li><p>- Demander leur rectification ou suppression</p></li>
                        <li><p>- Demander la limitation du traitement</p></li>
                        <li><p>- Vous opposer au traitement</p></li>
                        <li><p>- Retirer votre consentement (quand applicable)</p></li>
                    </ul>
                    <p>Pour exercer ces droits, contactez : contact@trevn.app</p>
                </LegalSection>

                <LegalSection number={10} title={"Données des mineurs"}>
                    <p>
                        Le Service est réservé aux personnes âgées d’au moins 13 ans. <br/>
                        Les utilisateurs de moins de 16 ans doivent obtenir l’autorisation d’un parent ou tuteur pour utiliser le Service.
                    </p>
                </LegalSection>

                <LegalSection number={11} title={"Modifications de la Politique de confidentialité"}>
                    <p>
                        L’éditeur se réserve le droit de modifier cette Politique à tout moment. <br/>
                        Les utilisateurs seront informés de toute modification importante. <br/>
                        L’utilisation continue du Service après modification vaut acceptation de la nouvelle Politique.
                    </p>
                </LegalSection>

                <LegalSection number={12} title={"Contact"}>
                    <p>Pour toute question relative à la protection de vos données : contact@trevn.app</p>
                </LegalSection>
            </main>

            <div className={styles.linksContainer}>
                <h3>Liens utiles</h3>
                <ul>
                    <li><Link href={"/legals"}>Mentions légales</Link></li>
                    <li><Link href={"/cgu"}>Conditions Générales d&apos;Utilisation (CGU)</Link></li>
                </ul>
            </div>

            <footer>
                <Link href={"#privacyPage"} className={styles.topPageButton}>
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
