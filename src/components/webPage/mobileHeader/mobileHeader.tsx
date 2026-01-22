'use client'

import styles from "./mobileHeader.module.scss";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {motion, useAnimation} from "framer-motion";
import Link from "next/link";

interface MobileHeaderProps {
    homeButton?: boolean;
}

export default function MobileHeader({homeButton}: MobileHeaderProps) {
    const controls = useAnimation();
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const menuMobileRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const runAnimation = async () => {
            if (openMobileMenu) {
                await controls.start({
                    width: 220,
                    transition: { duration: 0.1, ease: "easeInOut" },
                });

                await controls.start({
                    height: (homeButton ? 217 : 168),
                    transition: { duration: 0.2, ease: "easeInOut" },
                });
            } else {
                await controls.start({
                    height: 66,
                    transition: { duration: 0.1 },
                });

                await controls.start({
                    width: 66,
                    transition: { duration: 0.1 },
                });
            }
        };

        runAnimation();
    }, [openMobileMenu, controls]);

    useEffect(() => {
        if (!openMobileMenu) return;

        const handleOutsideInteraction = (event: Event) => {
            if (
                menuMobileRef.current &&
                !menuMobileRef.current.contains(event.target as Node)
            ) {
                setOpenMobileMenu(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsideInteraction);
        document.addEventListener("touchstart", handleOutsideInteraction);
        document.addEventListener("scroll", handleOutsideInteraction, true);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideInteraction);
            document.removeEventListener("touchstart", handleOutsideInteraction);
            document.removeEventListener("scroll", handleOutsideInteraction, true);
        };
    }, [openMobileMenu]);

    return (
        <div className={styles.mobileHeader}>
            <Image
                src={'/logo/logotype_empty.svg'}
                alt={"Logo Icon"}
                width={44}
                height={24}
                className={styles.mobileLogo}
            />

            <motion.div
                initial={{ width: 66, height: 66 }}
                animate={controls}
                className={`${styles.mobileMenu} ${openMobileMenu ? styles.mobileMenuOpen : ""}`}
                ref={menuMobileRef}
            >
                <div className={styles.mobileMenuHeader}>
                    <h3>Menu</h3>
                    <button
                        className={styles.mobileMenuButton}
                        type="button"
                        onClick={() => setOpenMobileMenu(prev => !prev)}
                    >
                        <Image src="/icons/menu.svg" alt="Menu Icon" width={26} height={26} />
                    </button>
                </div>

                <div className={styles.mobileMenuContainer}>
                    {homeButton && (
                        <>
                            <Link href="/" className={styles.homeButton}>
                                <button>
                                    Accueil
                                    <Image src="/icons/home.svg" alt="Home Icon" width={14} height={14} />
                                </button>
                            </Link>
                            <div className={styles.bar}></div>
                        </>
                    )}
                    <Link href="/login">
                        <button>Connexion</button>
                    </Link>
                    <Link href="/signup" className={styles.buttonBorder}>
                        <button>Inscription</button>
                    </Link>
                </div>
            </motion.div>

            <div className={styles.desktopAuthButtons}>
                <Link href="/login">
                    <button>Connexion</button>
                </Link>
                <Link href="/signup" className={styles.buttonBorder}>
                    <button>Inscription</button>
                </Link>
            </div>
        </div>
    )
}