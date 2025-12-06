import styles from "./glassButton.module.scss";
import Image from "next/image";
import {ReactNode} from "react";
import Link from "next/link";

type ButtonTypeProps = "link" | "submit" | "button"

type GlassButtonProps = {
    children: ReactNode,
    type: ButtonTypeProps,
    linkHref?: string | "",
    iconPath?: string | null,
    handleClick?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GlassButton({children, type, linkHref = "", iconPath = "", handleClick}: GlassButtonProps) {

    return (
        <>
            {type === "link" ? (
                <Link href={linkHref} className={styles.glassBtn}>
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
            ) : type === "submit" ? (
                <button type={"submit"} className={styles.glassBtn}>
                    {children}
                </button>
            ) : (
                <button onClick={() => handleClick && handleClick(false)} type={"button"} className={`${styles.glassBtn} ${styles.button}`}>
                    {children}
                </button>
            )}
        </>
    )
}