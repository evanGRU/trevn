import styles from "./legalSection.module.scss";
import React from "react";

export default function LegalSection({children, number, title}: { children: React.ReactNode,number: number, title: string }) {

    return (
        <div className={styles.legalSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                    <p>{number}</p>
                </div>
                <h2>{title}</h2>
            </div>

            <div className={styles.sectionContent}>
                {children}
            </div>
        </div>
    )
}