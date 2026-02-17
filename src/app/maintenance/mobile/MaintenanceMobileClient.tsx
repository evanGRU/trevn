'use client'

import styles from './page.module.scss';
import React from "react";
import Image from "next/image";
import GlassButton from "@/components/general/glassButton/glassButton";
import {useRouter} from "next/navigation";
import {createClient} from "@/utils/supabase/client";

export default function MaintenanceMobilePageClient() {
    const supabase = createClient();
    const router = useRouter();

    const signout = async () => {
        await supabase.auth.signOut()
        router.replace('/');
    }

    return (
        <div className={styles.maintenanceMobilePage}>
            <div className={styles.maintenanceMobileHeader}>
                <Image
                    src="/logo/logotype_empty.svg"
                    alt="Logotype Trevn"
                    width={24}
                    height={40}
                    className={styles.logo}
                />
            </div>

            <div className={styles.maintenanceMobileContainer}>
                <h1>La version mobile est actuellement en préparation</h1>

                <div className={styles.texts}>
                    <p>Nous travaillons à son optimisation pour vous proposer une expérience idéale sur smartphone et tablette.</p>
                    <p>En attendant, vous pouvez profiter pleinement de l’application dès maintenant depuis votre ordinateur.</p>
                    <p>Merci de votre patience et à très vite sur la version mobile !</p>
                </div>

                <GlassButton type={"button"} handleClick={() => signout()}>Se déconnecter</GlassButton>
            </div>
        </div>
    );
}
