import styles from "./settingSection.module.scss";
import React from "react";
import Image from "next/image";

interface SettingSectionProps {
    children: React.ReactNode;
    title: string;
    code: string;
    isSectionOpen: boolean;
    setOptionsOpen: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function SettingSection({children, title, code, isSectionOpen, setOptionsOpen}: SettingSectionProps) {

    return (
        <div className={`${styles.settingSection} ${isSectionOpen ? styles.settingSectionOpen : ""}`}>
            <div
                className={styles.settingHeader}
                onClick={() => setOptionsOpen(prev => prev === code ? null : code)}
            >
                <h3>{title}</h3>
                <Image
                    src={"/icons/arrowUnfold.svg"}
                    alt={"Arrow unfold icon"}
                    height={32}
                    width={32}
                />
            </div>

            <div className={styles.settingContent}>
                {children}
            </div>
        </div>
    )
}