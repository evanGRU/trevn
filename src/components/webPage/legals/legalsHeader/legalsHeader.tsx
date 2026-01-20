import styles from "./legalsHeader.module.scss";
import Image from "next/image";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import Link from "next/link";

export default function LegalsHeader() {

    return (
        <header className={styles.headerContainer}>
            <Image
                src={'/logo/logo_empty.svg'}
                alt={"Logo Icon"}
                height={36}
                width={190}
                className={styles.logo}
            />

            <Image
                src={'/logo/logotype_empty.svg'}
                alt={"Logo Icon"}
                height={36}
                width={61}
                className={styles.logotype}
            />

            <Link href={"/login"}>
                <DefaultButton>CONNEXION</DefaultButton>
            </Link>
        </header>
    )
}