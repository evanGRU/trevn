"use client";

import styles from "./page.module.scss";
import {useCallback, useRef, useState} from "react";
import Image from "next/image";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import GroupsSidebar from "@/components/app/groups/groupsSidebar/groupsSidebar";
import NewGroupModal from "@/components/app/groups/newGroupModal/newGroupModal";
import useSWR from "swr";
import {Profile} from "@/utils/types";
import MainHeader from "@/components/app/mainHeader/mainHeader";
import {fetcher, smoothScroll} from "@/utils/globalFunctions";
import {GamesListHandle} from "@/components/app/games/gamesList/gamesList";
import { GamesScrollContext } from "@/utils/GamesScrollContext";

export default function GroupsPageLayoutClient({profile, children}: { profile: Profile, children: React.ReactNode}) {
    const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState<boolean>(false);

    const containerRef = useRef<HTMLElement>(null);
    const gamesListRef = useRef<GamesListHandle>(null);
    const isScrollingRef = useRef(false);
    const atBottomRef = useRef(false);

    const { data: groupsList, mutate: refreshGroups } = useSWR(
        '/api/groups',
        (url) => fetcher(url, "Impossible de récupérer la liste des groupes. Essaye de rafraîchir la page.")
    );

    const handleScroll = useCallback(() => {
        const parent = containerRef.current;
        if (!parent || isScrollingRef.current) return;

        isScrollingRef.current = true;
        const direction = atBottomRef.current ? "top" : "bottom";

        smoothScroll(parent, direction, () => {
            atBottomRef.current = !atBottomRef.current;
            isScrollingRef.current = false;

            if (atBottomRef.current) {
                gamesListRef.current?.enableScroll();
            } else {
                gamesListRef.current?.disableScroll();
            }
        });
    }, []);

    return (
        <div className={styles.mainPage}>
            <MainHeader profile={profile}/>

            <div className={styles.mainAppContainer}>
                <GroupsSidebar
                    groups={groupsList ?? []}
                    setModalState={setIsNewGroupModalOpen}
                />
                <GamesScrollContext.Provider value={gamesListRef}>
                    <main ref={containerRef} className={`mainContainer ${styles.mainContentContainer}`} onScroll={handleScroll}>
                        {groupsList?.length === 0 ? (
                            <div className={styles.noGroupsContainer}>
                                <h1>C’est un peu vide ici…</h1>
                                <p>Crée ton premier groupe !</p>

                                <DefaultButton handleClick={() => setIsNewGroupModalOpen(true)}>
                                    <Image src="/icons/plus.svg" width={20} height={20} alt="Plus icon" />
                                    Nouveau groupe
                                </DefaultButton>
                            </div>
                        ) : children}
                    </main>
                </GamesScrollContext.Provider>
            </div>

            {isNewGroupModalOpen && (
                <NewGroupModal
                    setModal={setIsNewGroupModalOpen}
                    refreshGroups={refreshGroups}
                />
            )}
        </div>
    );
}
