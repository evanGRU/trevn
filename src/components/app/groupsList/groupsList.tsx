import styles from "./groupsList.module.scss";
import Image from "next/image";

export default function GroupsList() {
    return (
        <div className={styles.groupsListContainer}>
            <div className={styles.groupsListHeader}>
                <div className={styles.groupsTitle}>
                    <h4>Tous tes groupes</h4>
                </div>

                <div className={styles.iconButton}>
                    <Image
                        src="/icons/order/orderDefault.svg"
                        alt="Icône de tri"
                        width={18}
                        height={18}
                    />
                </div>
            </div>
        </div>
    )
}