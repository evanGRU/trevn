import styles from "./mainModalHeader.module.scss";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {useMediaQueries} from "@/utils/helpers/useMediaQueries";


export default function MainModalHeader({children, hrefPath} : {children: React.ReactNode, hrefPath: string}) {
    const {isTablet} = useMediaQueries();
    return (
        <div className={styles.mainModalHeader}>
            <Link href={hrefPath} className={styles.backButton}>
                <Image
                    src={`/icons/${isTablet ? "home.svg" : "arrowUnfold.svg" }`}
                    alt="Home Icon"
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