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
    handleClick?: React.MouseEventHandler<HTMLButtonElement>;
    isDisabled?: boolean;
}

export default function GlassButton({children, type, linkHref = "", iconPath = "", handleClick, isDisabled}: GlassButtonProps) {

    return (
        <>
            {type === "link" ? (
                <Link href={linkHref} className={`glassButtonGlobal ${styles.glassBtn}`}>
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
                <button
                    type={"submit"}
                    className={`glassButtonGlobal ${styles.glassBtn} ${isDisabled ? "glassButtonDisabled" : ""}`}
                    disabled={isDisabled}
                >
                    {children}
                </button>
            ) : (
                <button
                    onClick={handleClick}
                    type={"button"}
                    className={`
                        glassButtonGlobal 
                        ${styles.glassBtn} 
                        ${styles.button}
                        ${isDisabled ? styles.disabled : ""}
                    `}>
                    {children}
                </button>
            )}
        </>
    )
}