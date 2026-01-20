import styles from "./creditsFooter.module.scss";
import React from "react";

export default function CreditsFooter() {
    return (
        <div className={styles.footer}>
            <p>© 2026 Trevn</p>
            <div className={styles.devByContainer}>
                <p>dev by <span>Evan Gruchot</span></p>
            </div>
        </div>
    )
}