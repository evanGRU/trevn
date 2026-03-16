import styles from "./globalMobileHeader.module.scss";
import Image from "next/image";
import React from "react";
import MobileGenericButton from "@/components/app/responsive/mobileGenericButton/mobileGenericButton";
import {mobileGenericButtonDetails} from "@/utils/types";

interface GlobalMobileHeader {
    mobileGenericButtonArray: mobileGenericButtonDetails[];
}

export default function GlobalMobileHeader({mobileGenericButtonArray} : GlobalMobileHeader) {

    return (
        <div className={styles.globalHeaderResponsive}>
            <Image src="/logo/logotype_empty.svg" alt="Logotype" className={styles.logo} width={60} height={36}/>

            <div className={styles.headerButtons}>
                {mobileGenericButtonArray.map((headerButton: mobileGenericButtonDetails) =>
                    <MobileGenericButton buttonDetails={headerButton} key={`${headerButton.content}-button`}/>
                )}
            </div>
        </div>
    );
}