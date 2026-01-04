"use client";

import {useParams} from "next/navigation";
import {ProfileDefault, SelectedMenu} from "@/utils/types";
import styles from "./page.module.scss";
import {DbImage} from "@/components/general/dbImage/dbImage";
import {fetcher, getPublicAvatarUrl} from "@/utils/globalFunctions";
import useSWR from "swr";
import {useState} from "react";
import {GamesList} from "@/components/app/games/gamesList/gamesList";
import {useGamesScroll} from "@/utils/GamesScrollContext";
import {MembersList} from "@/components/app/members/membersList";
import Loader from "@/components/general/loader/loader";

export default function GroupDetailsClient({profile} : {profile: ProfileDefault}) {
    const { groupId } = useParams();
    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>("games")
    const gamesListRef = useGamesScroll();

    const { data: group, isLoading, mutate: refreshGroup } = useSWR(
        groupId ? `/api/groups/detail?groupId=${groupId}` : null,
        (url) => fetcher(url, "Impossible de récupérer les infos de ce groupe. Essaye de rafraîchir la page.")
    );

    const { data: members, isLoading: membersLoading, mutate: refreshMembers } = useSWR(
        groupId ? `/api/groups/members?groupId=${groupId}` : null,
        (url) => fetcher(url, "Impossible de récupérer les infos sur les membres de ce groupe. Essaye de rafraîchir la page.")
    );

    const getSelectedContent = () => {
        switch (selectedMenu) {
            case "games":
                return (
                    <GamesList
                        ref={gamesListRef}
                        groupId={groupId}
                        members={members}
                    />);
            case "members":
                return (
                    <MembersList
                        members={members}
                        profile={profile}
                        refreshMembers={refreshMembers}
                        group={group}
                    />
                );
            case "settings":
                return <h2>Paramètres</h2>;
        }
    }

    return !isLoading && !membersLoading ? (
        <>
            <div className={styles.groupDetailsSection}>
                <div className={styles.groupDetailsContainer}>
                    <DbImage
                        src={getPublicAvatarUrl(group?.avatar.type, group?.avatar.name)}
                        alt={"Avatar group"}
                        width={120}
                        height={120}
                    />
                    <div className={styles.groupDetailsContent}>
                        <h1>{group?.name}</h1>
                        <p>
                            {group?.description}
                        </p>
                    </div>
                </div>
            </div>

            <nav className={styles.groupNavbarSection}>
                <ul>
                    <li
                        onClick={() => setSelectedMenu("games")}
                        className={`${selectedMenu === "games" ? styles.selectedMenu : ""}`}
                    >
                        Jeux
                    </li>
                    <li
                        onClick={() => setSelectedMenu("members")}
                        className={`${selectedMenu === "members" ? styles.selectedMenu : ""}`}
                    >
                        Membres
                    </li>
                    <li
                        onClick={() => setSelectedMenu("settings")}
                        className={`${selectedMenu === "settings" ? styles.selectedMenu : ""}`}
                    >
                        Paramètres
                    </li>
                </ul>
            </nav>

            <div className={styles.groupSelectedContent}>
                {getSelectedContent()}
            </div>
        </>
    ) : (
        <Loader/>
    );
}
