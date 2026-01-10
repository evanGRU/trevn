import styles from "./settingSection.module.scss";
import React from "react";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";

interface SettingSectionProps {
    children: React.ReactNode;
    title: string;
    code: string;
    isSectionOpen: boolean;
    setOptionsOpen: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function SettingSection({children, title, code, isSectionOpen, setOptionsOpen}: SettingSectionProps) {

    return (
        <div className={styles.settingSection}>
            <div
                className={styles.settingHeader}
                onClick={() => setOptionsOpen(prev => (prev === code ? null : code))}
            >
                <h3>{title}</h3>

                <Image
                    src="/icons/arrowUnfold.svg"
                    alt="Arrow unfold icon"
                    height={32}
                    width={32}
                    style={isSectionOpen ? {transform: "rotateZ(180deg)"} : {}}
                />
            </div>

            <AnimatePresence initial={false}>
                {isSectionOpen && (
                    <motion.div
                        className={`${styles.settingContent} ${isSectionOpen ? styles.settingContentOpen : ""}`}
                        initial={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0}}
                        animate={{ height: "auto", opacity: 1, paddingTop: "var(--space-24)", paddingBottom: "var(--space-32)" }}
                        exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}