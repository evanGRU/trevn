import styles from "./mainModalHeader.module.scss";
import Image from "next/image";
import Link from "next/link";
import React from "react";


export default function MainModalHeader({children, hrefPath} : {children: React.ReactNode, hrefPath: string}) {
    return (
        <div className={styles.mainModalHeader}>
            <Link href={hrefPath} className={styles.backButton}>
                <Image
                    src="/icons/arrowUnfold.svg"
                    alt="Logotype Trevn"
                    width={12}
                    height={12}
                />
                <p>{children}</p>
            </Link>

            <Image
                src="/logo/logotype_empty.svg"
                alt="Logotype Trevn"
                width={24}
                height={40}
                className={styles.logo}
            />
        </div>
    )
}