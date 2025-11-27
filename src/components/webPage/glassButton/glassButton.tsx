import styles from "./glassButton.module.scss";
import Image from "next/image";
import {ReactNode} from "react";
import Link from "next/link";

type ButtonTypeProps = "link" | "submit"

type HomeCardProps = {
    children: ReactNode,
    type: ButtonTypeProps,
    linkHref: string | "",
    iconPath: string | null
}

export default function GlassButton({children, type, linkHref = "", iconPath = ""}: HomeCardProps) {

    return (
        <>
            {type === "link" ? (
                <Link href={linkHref} className={`${styles.glassBtn} ${iconPath ? styles.withIcon : ""}`}>
                    {iconPath && (
                        <Image
                            src={iconPath}
                            alt={"Button icon"}
                            width={30}
                            height={30}
                        />
                    )}
                    {children}
                </Link>
            ) : (
                <button type={"submit"} className={styles.glassBtn}>
                    {children}
                </button>
            )}
        </>
    )
}