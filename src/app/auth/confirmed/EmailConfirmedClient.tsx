'use client'

import {AnimatePresence, motion} from "framer-motion";
import GlassButton from "@/components/general/glassButton/glassButton";
import React from "react";
import {useRouter} from "next/navigation";
import styles from "./page.module.scss";
import MainModalHeader from "@/components/general/mainModalHeader/mainModalHeader";
import {useMediaQueries} from "@/utils/helpers/useMediaQueries";

export default function EmailConfirmedPageClient() {
    const router = useRouter();
    const {isMobile} = useMediaQueries();

    return (
        <div className={styles.confirmPage}>
            {isMobile && (
                <div className={styles.confirmHeader}>
                    <MainModalHeader hrefPath={"/"}>{"Accueil"}</MainModalHeader>
                </div>
            )}
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.confirmContainer}
                >
                    <div className={styles.confirmContainerHeader}>
                        {!isMobile && (
                            <MainModalHeader hrefPath={"/"}>{"Accueil"}</MainModalHeader>
                        )}
                        <div className={styles.confirmHeaderTexts}>
                            <h1>Email confirmé</h1>
                            <p>Ton adresse email a bien été confirmée et ton compte Trevn est désormais entièrement activé.</p>
                        </div>
                    </div>

                    <GlassButton type={"button"} handleClick={() => router.push("/login")}>
                        {"Se connecter"}
                    </GlassButton>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
