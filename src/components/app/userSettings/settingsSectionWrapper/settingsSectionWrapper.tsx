import React from "react";
import styles from "./settingsSectionWrapper.module.scss";

interface SettingsSectionWrapperProps {
    children: React.ReactNode;
    sectionTitle: string;
}

export default function SettingsSectionWrapper({children, sectionTitle}: SettingsSectionWrapperProps) {

    return (
        <div className={styles.settingsSectionContainer}>
            <h3>{sectionTitle}</h3>
            {children}
        </div>
    );
}