'use client'

import GlassButton from "@/components/general/glassButton/glassButton";
import styles from "./page.module.scss";
import HomeCard from "@/components/webPage/homeCard/homeCard";
import Image from "next/image";
import Link from "next/link";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import {useEffect, useRef, useState} from "react";
import Script from "next/script";
import Player from '@vimeo/player';
import { motion } from "framer-motion";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
    }
};

export default function WebPageClient() {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [videoPlaying, setVideoPlaying] = useState(false);

    useEffect(() => {
        if (!iframeRef.current) return;

        const player = new Player(iframeRef.current);
        player.on('play', () => {
            setVideoPlaying(true);
        });

        return () => {
            player.off('play');
        };
    }, []);

    return (
        <div className={styles.homePage}>
            <section className={styles.heroSection}>
                <Script
                    src="https://player.vimeo.com/api/player.js"
                    strategy="afterInteractive"
                />

                <div className={`${styles.heroVideoContainer} ${videoPlaying ? styles.heroVideoContainerLoaded : ""}`}>
                    <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1.05 }}
                        transition={{ duration: 1 }}
                        className={styles.heroImageContainer}
                    >
                        <Image
                            src={'/webPage/heroImage2.jpg'}
                            alt={"Hero Image"}
                            width={1920}
                            height={1080}
                            className={styles.heroImage}
                        />
                    </motion.div>

                    <iframe
                        ref={iframeRef}
                        src="https://player.vimeo.com/video/1154389024?background=1&autoplay=1&loop=1&muted=1&autopause=0"
                        frameBorder="0"
                        allow="autoplay"
                        title="BACKGROUND_VIDEO"
                        className={styles.heroVideo}
                    ></iframe>
                </div>

                <div className={styles.heroContentContainer}>
                    <div className={styles.heroTitleContainer}>
                        <motion.div
                            initial={{ opacity: 0, translateY: -40 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.6 }}
                            className={styles.heroTitle}
                        >
                            <Image
                                src={'/logo/logo_empty.svg'}
                                alt={"Logo Icon"}
                                width={660}
                                height={126}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 1 }}
                        transition={{ duration: 0.6 }}
                        className={styles.heroCTAContainer}
                    >
                        <GlassButton type={"link"} linkHref={"/login"}>
                            Commence dès maintenant
                        </GlassButton>
                    </motion.div>
                </div>
            </section>

            <section className={styles.cardsSection}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.cardSectionTitleContainer}
                >
                    <h2>Comment ça marche?</h2>
                </motion.div>

                <motion.div
                    className={styles.cardsContainer}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div variants={itemVariants}>
                        <HomeCard variant="background" cardPosition="one">
                            <h4>Crée ton groupe</h4>
                            <p>Ouvre un groupe dédié à vos soirées pour centraliser tous vos jeux.</p>
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <HomeCard variant="default" cardPosition="two">
                            <h4>Invite tes amis</h4>
                            <p>Partage le lien et laisse tes potes rejoindre instantanément.</p>
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <HomeCard variant="background" cardPosition="three">
                            <h4>Ajoute des jeux</h4>
                            <p>Sélectionne les jeux qui vous plaisent et construisez votre liste.</p>
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <HomeCard variant="default" cardPosition="four">
                            <h4>Partage ton avis</h4>
                            <p>Like tes jeux préférés afin d’aider le groupe à trancher.</p>
                        </HomeCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <HomeCard variant="background" cardPosition="five">
                            <h4>Lance ta soirée</h4>
                            <p>Découvrez les jeux les mieux notés et lancez la soirée sans prise de tête.</p>
                        </HomeCard>
                    </motion.div>
                </motion.div>
            </section>

            <section className={styles.partnerSection}>
                <Image
                    src="/webPage/webDecoration1.svg"
                    alt="Web Decoration 01"
                    width={1920}
                    height={430}
                    className={styles.decoration}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.partnerContainer}
                >
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
                </motion.div>
            </section>

            <section className={styles.motionSection}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.motionContainer}
                >
                    <Image
                        src={'/webPage/gameCapsule.svg'}
                        alt={"Game Capsule"}
                        width={500}
                        height={10}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className={styles.contentContainer}
                >
                    <h2>Tes soirées <br/>commencent <br/> maintenant</h2>
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
                        <p>Participe à la béta, donne ton avis et aide-nous à créer la meilleure <br/> plateforme pour les soirées gaming entre potes.</p>
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
                <div className={styles.decoration}></div>
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
                    <p>Evan Gruchot</p>
                    <p>©TREVN</p>
                    <Link href={"/privacy"} className={styles.linkButton}>
                        <p>Mentions légales</p>
                    </Link>
                </div>

            </section>
        </div>
    );
}
