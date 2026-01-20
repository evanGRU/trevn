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
    title: "Conditions Générales d'Utilisation",
    robots: {
        index: false,
        follow: true,
    },
}

export default async function CguPage() {
    return (
        <div className={styles.cguPage} id={"cguPage"}>
            <LegalsHeader/>

            <div className={styles.headerTitle}>
                <BackButton/>
                <h1>Conditions Générales d&apos;Utilisation (CGU)</h1>
                <LastUpdateContainer lastUpdate={"20 janvier 2026"}/>
            </div>

            <main className={styles.contentList}>
                <LegalSection number={1} title={"Objet"}>
                    <p>Les présentes Conditions Générales d’Utilisation (CGU) définissent les modalités d’accès et d’utilisation du site et de l’application Trevn (ci-après « le Service »).</p>
                    <p>Trevn permet aux utilisateurs d’organiser des groupes, de proposer des jeux et d’interagir autour de leurs choix de jeux vidéo.</p>
                </LegalSection>

                <LegalSection number={2} title={"Acceptation des CGU"}>
                    <p>L’accès et l’utilisation du Service impliquent l’acceptation pleine et entière des présentes CGU.</p>
                    <p>En créant un compte ou en utilisant le Service, l’utilisateur reconnaît avoir pris connaissance des CGU et les accepter sans réserve.</p>
                </LegalSection>

                <LegalSection number={3} title={"Accès au service"}>
                    <p>Le Service est accessible gratuitement à tout utilisateur disposant d’un accès à Internet.</p>
                    <p>L’éditeur se réserve le droit de suspendre, limiter ou interrompre l’accès au Service pour des raisons techniques, de maintenance ou de sécurité, sans obligation de préavis.</p>
                </LegalSection>

                <LegalSection number={4} title={"Création de compte"}>
                    <p>L’utilisation de Trevn nécessite la création d’un compte utilisateur.</p>
                    <p>
                        L’utilisateur s’engage à fournir des informations exactes lors de son inscription et à les maintenir à jour. <br/>
                        Il est responsable de la confidentialité de ses identifiants et de toute activité réalisée depuis son compte.
                    </p>
                </LegalSection>

                <LegalSection number={5} title={"Conditions d’âge"}>
                    <p>
                        Le Service est réservé aux personnes âgées d’au moins 13 ans. <br/>
                        L’éditeur ne saurait être tenu responsable en cas de fausse déclaration.
                    </p>
                </LegalSection>

                <LegalSection number={6} title={"Comportement des utilisateurs"}>
                    <p>L’utilisateur s’engage à utiliser le Service de manière loyale et conforme à la loi.</p>
                    <ul className={styles.list}>
                        <p className={styles.listTitle}>Il est notamment interdit de :</p>
                        <li><p>- publier des contenus illicites, offensants, diffamatoires ou haineux</p></li>
                        <li><p>- usurper l’identité d’un tiers</p></li>
                        <li><p>- perturber le bon fonctionnement du Service </p></li>
                        <li><p>- tenter d’accéder de manière non autorisée aux systèmes du Service</p></li>
                    </ul>
                    <p>Tout manquement pourra entraîner la suspension ou la suppression du compte, sans préavis.</p>
                </LegalSection>

                <LegalSection number={7} title={"Contenus publiés par les utilisateurs"}>
                    <p>Les utilisateurs sont responsables des contenus qu’ils publient.</p>
                    <p>L’éditeur n’exerce pas de contrôle a priori, mais se réserve le droit de retirer tout contenu manifestement illicite ou contraire aux présentes CGU.</p>
                </LegalSection>

                <LegalSection number={8} title={"Propriété intellectuelle"}>
                    <p>Le Service et ses éléments (textes, images, logos, graphismes, code) sont protégés par le droit de la propriété intellectuelle.</p>
                    <p>Toute utilisation non autorisée est interdite. Pour plus de détails, voir les Mentions légales.</p>
                </LegalSection>

                <LegalSection number={9} title={"Responsabilité"}>
                    <p>L’éditeur met tout en œuvre pour assurer le bon fonctionnement du Service, mais ne garantit pas l’absence d’erreurs ou d’interruptions.</p>
                    <p>L’éditeur ne pourra être tenu responsable des dommages directs ou indirects résultant de l’utilisation du Service.</p>
                </LegalSection>

                <LegalSection number={10} title={"Données personnelles"}>
                    <p>Les modalités de collecte et de traitement des données personnelles sont décrites dans la Politique de confidentialité, accessible depuis le site.</p>
                </LegalSection>

                <LegalSection number={11} title={"Modification des CGU"}>
                    <p>
                        L’éditeur se réserve le droit de modifier les présentes CGU à tout moment. <br/>
                        L’utilisation continue du Service après modification vaut acceptation des nouvelles CGU.
                    </p>
                </LegalSection>

                <LegalSection number={12} title={"Contact"}>
                    <p>Pour toute question relative aux présentes CGU : contact@trevn.app</p>
                </LegalSection>
            </main>

            <div className={styles.linksContainer}>
                <h3>Liens utiles</h3>
                <ul>
                    <li><Link href={"/legals"}>Mentions légales</Link></li>
                    <li><Link href={"/privacy"}>Politique de confidentialité</Link></li>
                </ul>
            </div>

            <footer>
                <Link href={"#cguPage"} className={styles.topPageButton}>
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
