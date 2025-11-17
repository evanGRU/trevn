import styles from "./buttonLink.module.scss";
import Link from "next/link"
import { ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "CTA"

type ButtonLinkProps = {
    href: string
    children: ReactNode
    variant?: ButtonVariant
}

export default function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
    return (
        <Link
            href={href}
            className={`${styles.button} ${styles[`button--${variant}`]}`}
        >
            {children}
        </Link>
    )
}