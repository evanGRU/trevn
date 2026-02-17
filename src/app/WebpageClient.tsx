'use client'

import GlassButton from "@/components/general/glassButton/glassButton";
import styles from "./page.module.scss";
import HomeCard from "@/components/webPage/homeCard/homeCard";
import Image from "next/image";
import Link from "next/link";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import {useRef} from "react";
import Script from "next/script";
import {motion} from "framer-motion";
import LegalsFooter from "@/components/webPage/creditsFooter/creditsFooter";
import MobileHeader from "@/components/webPage/mobileHeader/mobileHeader";
import {useMediaQueries} from "@/utils/helpers/useMediaQueries";

const heroContainerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            staggerChildren: 0.2,
            delayChildren: 0.2,
        },
    },
};

const heroItemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.4,
        },
    },
};

const howContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const howItemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
    }
};

export default function WebPageClient() {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const {isMobile, isTablet, isLaptop} = useMediaQueries();

    return (
        <div className={styles.homePage}>
            <section className={styles.heroSection}>
                <MobileHeader/>

                <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive"/>
                <div className={styles.heroVideoContainer}>
                    <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 0.6, scale: 1.05 }}
                        transition={{ duration: 1 }}
                        className={styles.backgroundHeroContainer}
                    >
                        <motion.div
                            initial={{ translateY: isLaptop ? "-50%" : "-60%" }}
                            animate={{ translateY: isLaptop ? "-80%" : "-65%" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className={styles.heroFrameTop}
                        />

                        <iframe
                            ref={iframeRef}
                            src="https://player.vimeo.com/video/1154389024?background=1&autoplay=1&loop=1&muted=1&autopause=0"
                            frameBorder="0"
                            allow="autoplay"
                            title="BACKGROUND_VIDEO"
                            className={styles.heroVideo}
                        ></iframe>

                        <motion.div
                            initial={{ translateY: isLaptop ? "50%" : "60%" }}
                            animate={{ translateY: isLaptop ? "80%" : "65%" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className={styles.heroFrameBottom}
                        />
                    </motion.div>

                    <div className={styles.heroTitleContainer}>
                        <motion.div
                            initial={{ opacity: 0, scale: 1.1, filter: 'blur(2px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1 }}
                            className={styles.heroTitle}
                        >
                            <Image
                                src={'/logo/logotext_empty.svg'}
                                alt={"Logo Icon"}
                                width={150}
                                height={48}
                            />
                        </motion.div>
                    </div>
                </div>

                <div className={styles.heroContentContainer}>
                    <motion.div
                        variants={heroContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className={styles.heroCTAContainer}
                    >
                        <motion.div variants={heroItemVariants}>
                            <h1>Proposez, votez, jouez</h1>
                        </motion.div>

                        <motion.div variants={heroItemVariants}>
                            <p>
                                Vos soirées gaming {isMobile && <br />}
                                organisées avec vos amis, {isMobile && <br />}
                                rapidement et simplement.
                            </p>
                        </motion.div>

                        <motion.div variants={heroItemVariants}>
                            <GlassButton type="link" linkHref="/login">
                                Je commence
                            </GlassButton>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className={styles.cardsSection}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.cardSectionTitleContainer}
                >
                    <h2>Comment ça marche?</h2>
                    <p>Gérer vos soirées gaming n&apos;a jamais été aussi facile</p>
                </motion.div>

                <motion.div
                    className={styles.cardsContainer}
                    variants={howContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div variants={howItemVariants} className={isLaptop ? styles.homeCardDivLeft : ""}>
                        <HomeCard variant="background" cardPosition="one">
                            <h4>Créé ton groupe</h4>
                            {isTablet ? (
                                <p>Ouvre et personnalise ton propre groupe.</p>
                            ) : (
                                <p>Ouvre ton propre groupe en lui choisissant son nom et son avatar.</p>
                            )}
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={howItemVariants} className={isLaptop ? styles.homeCardDivRight : ""}>
                        <HomeCard variant="default" cardPosition="two">
                            <h4>Invite tes amis</h4>
                            {isTablet ? (
                                <p>Partage ton code ou ton lien d&apos;invitation.</p>
                            ) : (
                                <p>Partage ton code de groupe ou ton lien d&apos;invitation et laisse tes amis te rejoindre.</p>
                            )}
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={howItemVariants} className={isLaptop ? styles.homeCardDivLeft : ""}>
                        <HomeCard variant="background" cardPosition="three">
                            <h4>Ajoute des jeux</h4>
                            {isTablet ? (
                                <p>Sélectionnez vos jeux et créez votre wishlist.</p>
                            ) : (
                                <p>Sélectionnez les jeux qui vous plaisent et créez votre wishlist de groupe.</p>
                            )}
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={howItemVariants} className={isLaptop ? styles.homeCardDivRight : ""}>
                        <HomeCard variant="default" cardPosition="four">
                            <h4>Like tes préférés</h4>
                            {isTablet ? (
                                <p>Fait savoir à tes amis quels jeux tu préfères.</p>
                            ) : (
                                <p>Fait savoir à tes amis quels sont les jeux qui te plaisent le plus en les likant.</p>
                            )}
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={howItemVariants} className={isLaptop ? styles.homeCardDivLeft : ""}>
                        <HomeCard variant={isLaptop ? "background" : "default"} cardPosition="five">
                            <h4>Amusez-vous</h4>
                            {isTablet ? (
                                <p>Choisissez un jeu et lancez-vous !</p>
                            ) : (
                                <p>Choisissez un jeu parmis les jeux de votre liste et lancez votre partie !</p>
                            )}
                        </HomeCard>
                    </motion.div>
                </motion.div>
            </section>

            <section className={styles.partnerSection}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.partnerContainer}
                >
                    <h3>
                        Trouve tes jeux {isMobile && <br />}
                        préférés grâce à la {isMobile && <br />}
                        bibliothèque{" "}
                        <span className={styles.steamInline}>
                            <Image
                                src="/webPage/steamLogo.png"
                                alt="Steam logo"
                                width={180}
                                height={50}
                            />
                        </span>{" "}{isMobile && <br />}
                        intégrée à notre {isMobile && <br />}
                        plateforme.
                    </h3>
                </motion.div>
            </section>

            <section className={styles.motionSection}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.motionContainer}
                >
                    <Image
                        src={'/webPage/gameCapsule.png'}
                        alt={"Game Capsule"}
                        width={500}
                        height={10}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.contentContainer}
                >
                    <h2>Tes soirées {isMobile && <br />} commencent {isMobile && <br />} maintenant</h2>
                    <Link href={"/login"}>
                        <DefaultButton>
                            Créé ton premier groupe
                        </DefaultButton>
                    </Link>
                </motion.div>
            </section>

            <section className={styles.discordSection}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.discordContainer}
                >
                    <div className={styles.glassContainer}>
                        <h2>Rejoins <br/> la communauté</h2>
                        <p>Participe à la béta, donne ton avis et aide-nous à créer la meilleure {!isLaptop && <br/>} plateforme pour les soirées gaming entre potes.</p>
                        <GlassButton
                            type={"link"}
                            linkHref={"https://discord.gg/mvWp38PcrV"}
                            iconPath={"/webPage/discordIcon.svg"}
                            target={"_blank"}
                        >
                            Rejoindre la bêta
                        </GlassButton>
                    </div>
                </motion.div>
            </section>

            <section className={styles.footerSection}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.footerHeader}
                >
                    <Image
                        src={'/logo/logotype_empty.svg'}
                        alt={"Logo Icon"}
                        width={150}
                        height={70}
                    />
                    <h2>Merci pour ton soutien</h2>
                </motion.div>

                <div className={styles.footerContainer}>
                    <div className={styles.legalsContainer}>
                        <p>Informations légales</p>
                        {!isLaptop && <p>/</p>}
                        <div className={styles.legalsButtons}>
                            <Link href={"/legals"}>Mentions Légales</Link>
                            <Link href={"/privacy"}>Confidentialité</Link>
                            <Link href={"/cgu"}>CGU</Link>
                        </div>
                    </div>

                    <LegalsFooter/>
                </div>

            </section>
        </div>
    );
}
