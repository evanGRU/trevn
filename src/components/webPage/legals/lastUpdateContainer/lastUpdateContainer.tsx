import styles from "./lastUpdateContainer.module.scss";
import React from "react";

export default function LastUpdateContainer({lastUpdate}: { lastUpdate: string }) {

    return (
        <div className={styles.container}>
            <p>Dernière mise à jour : {lastUpdate}</p>
        </div>
    )
}