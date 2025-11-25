"use client"

import styles from "./page.module.scss";
import NavbarApp from "@/components/homepage/navbarApp/navbarApp";
import {useState} from "react";
import SearchGameModal from "@/components/homepage/searchGameModal/searchGameModal";

type Profile = {
    username: string;
    avatar_url: string | null;
};

type Group = {
    id: string;
    name: string;
    description: string | null;
    invite_code: string;
    created_at: string;
    created_by: string;
};

export default function GroupClient({ profile, group }: {profile: Profile | null, group: Group}) {
    const [isSearchGameModalOpen, setIsSearchGameModalOpen] = useState(false);

    return (
        <div className={styles.groupPage}>
            <NavbarApp profile={profile}/>

            <div className={styles.groupContainer}>
                <h1>GROUPE DETAIL</h1>

                <div className={styles.groupInfos}>
                    <h3>Infos du groupe</h3>
                    <p>Nom: {group.name}</p>
                    <p>Description: {group.description}</p>
                    <p>Créateur: {group.description}</p>
                    <p>Code d&apos;invitation: {group.invite_code}</p>
                </div>

                <div className={styles.gamesTable}>
                    <div className={styles.gamesTableHeader}>
                        <h3>Liste des jeux</h3>
                        <div className={styles.searchContainer}>
                            <button onClick={() => setIsSearchGameModalOpen(!isSearchGameModalOpen)}>Ajouter un jeu</button>
                            {isSearchGameModalOpen && (
                                <SearchGameModal/>
                            )}
                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}
