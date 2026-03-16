import styles from "./mobileGenericButton.module.scss";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import clsx from "clsx";
import {mobileGenericButtonDetails} from "@/utils/types";

export default function MobileGenericButton({buttonDetails, formId} : {buttonDetails: mobileGenericButtonDetails, formId?: string}) {
    return (
        <div className={clsx(
            styles.headerButton,
            buttonDetails.variant === "text" && styles.headerButtonText,
            buttonDetails.variant === "validation" && (
                buttonDetails.disabled
                    ? styles.disabled
                    : styles.greenBorder
            )
        )}>
            {buttonDetails.redirect ? (
                <Link href={buttonDetails.redirect}>
                    {buttonDetails.variant === "text" ? buttonDetails.content : (
                        <Image src={`/icons/${buttonDetails.content}.svg`} alt={`${buttonDetails.content} icon`} width={24} height={24}/>
                    )}
                </Link>
            ) : (
                <button type={formId ? "submit" : "button"} form={formId ?? ""} onClick={buttonDetails.callback} disabled={buttonDetails.disabled}>
                    {buttonDetails.variant === "text" ? buttonDetails.content : (
                        <Image src={`/icons/${buttonDetails.content}.svg`} alt={`${buttonDetails.content} icon`} width={24} height={24}/>
                    )}
                </button>
            )}
        </div>
    );
}