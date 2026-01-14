import GlassButton from "@/components/general/glassButton/glassButton";
import styles from "./page.module.scss";
import HomeCard from "@/components/webPage/homeCard/homeCard";
import Image from "next/image";
import type {Metadata} from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Trevn - Choisissez ensemble à quoi jouer ce soir",
    description: "La plateforme pour organiser vos soirées gaming, proposer des jeux et voter entre potes.",

    openGraph: {
        title: 'Trevn',
        description:
            'La plateforme pour organiser vos soirées gaming, proposer des jeux et voter entre potes.',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
        siteName: 'Trevn',
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/og_image.png`,
                width: 1200,
                height: 630,
                alt: 'Trevn – Choisissez ensemble à quoi jouer ce soir',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
};

export default function WebPage() {
  return (
    <div className={styles.homePage}>
        <section className={styles.heroSection}>
            <div className={styles.heroVideoContainer}>
                <iframe
                    src="https://player.vimeo.com/video/1154389024?background=1&autoplay=1&loop=1&muted=1&autopause=0"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className={styles.heroVideo}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    title="BACKGROUND_VIDEO"
                ></iframe>

                <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />
            </div>
        </section>

        <section className={styles.cardsSection}>
            <div className={styles.cardsTitleLogo}>
                <h2>Comment ça marche?</h2>
                <Image
                    src={'/logo/logotype_empty.svg'}
                    alt={"Logo Icon"}
                    width={120}
                    height={70}
                />
            </div>

            <div className={styles.cardsContainer}>
                <HomeCard variant={"background"} cardPosition={"one"}>
                    <h4>Crée ton groupe</h4>
                    <p>Ouvre un groupe dédié à vos soirées pour centraliser tous vos jeux.</p>
                </HomeCard>
                <HomeCard variant={"default"} cardPosition={"two"}>
                    <h4>Invite tes amis</h4>
                    <p>Partage le lien et laisse tes potes rejoindre instantanément.</p>
                </HomeCard>
                <HomeCard variant={"background"} cardPosition={"three"}>
                    <h4>Ajoute des jeux</h4>
                    <p>Sélectionne les jeux qui vous plaisent et construisez votre liste.</p>
                </HomeCard>
                <HomeCard variant={"default"} cardPosition={"four"}>
                    <h4>Partage ton avis</h4>
                    <p>Vote pour tes jeux préférés afin d’aider le groupe à trancher.</p>
                </HomeCard>
                <HomeCard variant={"background"} cardPosition={"five"}>
                    <h4>Lance ta soirée</h4>
                    <p>Découvrez les jeux les mieux notés et lancez la soirée sans prise de tête.</p>
                </HomeCard>
            </div>
        </section>

        <section className={styles.partnerSection}>
            <h3>
                Trouve tes jeux préférés grâce à la bibliothèque{" "}
                <span className={styles.steamInline}>
                    <Image
                        src="/webPage/steamLogo.png"
                        alt="Steam logo"
                        width={180}
                        height={50}
                    />
                </span>{" "}
                intégrée à notre plateforme.
            </h3>
        </section>

        <section className={styles.motionSection}>
            <div className={styles.motionContainer}>
                <Image
                    src={'/webPage/cardHover.svg'}
                    alt={"Logo Icon"}
                    width={500}
                    height={10}
                />
            </div>
            <div className={styles.contentContainer}>
                <h2>Crée ton <br/>premier groupe <br/>maintenant</h2>
                <GlassButton type={"link"} linkHref={"/login"}>
                    Créer ton premier groupe
                </GlassButton>
            </div>
        </section>

        <section className={styles.discordSection}>
            <div className={styles.discordContainer}>
                <div className={styles.glassContainer}>
                    <h2>Rejoins <br/> la communauté</h2>
                    <p>Participe à la béta, donne ton avis et aide-nous à créer la meilleure <br/> plateforme pour les soirées gaming entre potes.</p>
                    <GlassButton type={"link"} linkHref={"https://discord.gg/mvWp38PcrV"} iconPath={"/webPage/discordIcon.svg"}>
                        Rejoindre la bêta
                    </GlassButton>
                </div>
            </div>
        </section>

        <section className={styles.footerSection}>
            <Image
                src={'/logo/logotype_empty.svg'}
                alt={"Logo Icon"}
                width={150}
                height={70}
            />
            <h2>Merci pour ton soutien</h2>

            <div className={styles.footerContainer}>
                <p>Contact</p>
                <p>©TREVN</p>
                <p>Evan Gruchot</p>
            </div>
        </section>
    </div>
  );
}
