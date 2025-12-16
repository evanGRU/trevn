import styles from "./homeCard.module.scss";
import Image from "next/image";
import {ReactNode} from "react";
import {capitalize} from "@/utils/globalFunctions";

type HomeCardVariants = "default" | "background";

type HomeCardProps = {
    children: ReactNode,
    variant?: HomeCardVariants,
    cardPosition: string
}

export default function HomeCard({children, variant = "default", cardPosition}: HomeCardProps) {

    return (
        <div className={`${styles.card} ${variant === "background" ? styles.cardBackground : ""} ${styles[cardPosition]}`}>
            <div className={styles.cardIcon}>
                <Image
                    src={`/webPage/cards/CardIcon${capitalize(cardPosition)}.svg`}
                    alt={"Card icon"}
                    width={32}
                    height={32}
                />
            </div>

            <div className={styles.cardTexts}>
                {children}
            </div>
        </div>
    )
}