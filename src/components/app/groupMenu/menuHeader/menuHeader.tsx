import styles from "./menuHeader.module.scss";
import React from "react";

export default function MenuHeader({children, title}: { children?: React.ReactNode, title: string}) {
    return (
        <div className={styles.headerContainer}>
            <h2>{title}</h2>

            {children && (
                <div className={styles.headerButtonsContainer}>
                    {children}
                </div>
            )}
        </div>
    )
}