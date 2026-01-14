'use client'

import {AnimatePresence, motion} from "framer-motion";
import GlassButton from "@/components/general/glassButton/glassButton";
import React from "react";
import {useRouter} from "next/navigation";
import styles from "./page.module.scss";
import MainModalHeader from "@/components/general/mainModalHeader/mainModalHeader";

export default function EmailConfirmedPage() {
    const router = useRouter();

    return (
        <div className={styles.confirmPage}>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.confirmContainer}
                >
                    <div className={styles.confirmHeader}>
                        <MainModalHeader hrefPath={"/"}>{"Accueil"}</MainModalHeader>
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
