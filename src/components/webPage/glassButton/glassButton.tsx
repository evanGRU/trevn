import styles from "./glassButton.module.scss";
import Image from "next/image";
import {ReactNode} from "react";
import Link from "next/link";

type HomeCardProps = {
    children: ReactNode,
    linkHref: string,
    iconPath: string | null
}

export default function GlassButton({children, linkHref, iconPath = ""}: HomeCardProps) {

    return (
        <>
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
        </>
    )
}