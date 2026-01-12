import styles from "./loader.module.scss";
import Image from "next/image";


export default function Loader() {
    return (
        <div className={styles.loader}>
            <Image
                src={"/app/loading.gif"}
                alt={"Loading anim"}
                width={64}
                height={64}
            />
            <p>Chargement en cours...</p>
        </div>
    )
}