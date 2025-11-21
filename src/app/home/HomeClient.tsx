"use client"

import styles from "./page.module.scss";
import NavbarApp from "@/components/homepage/navbarApp/navbarApp";
type Profile = {
    username: string;
    avatar_url: string | null;
};

export default function HomeClient({ profile }: {profile: Profile | null}) {
    return (
        <div className={styles.homePage}>
            <NavbarApp profile={profile}/>

            <div>
                <h1>Page des groupes</h1>
            </div>
        </div>
    )
}
