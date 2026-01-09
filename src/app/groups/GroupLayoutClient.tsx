"use client";

import styles from "./page.module.scss";
import {useCallback, useRef, useState} from "react";
import Image from "next/image";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import GroupsSidebar from "@/components/app/groups/groupsSidebar/groupsSidebar";
import NewGroupModal from "@/components/app/groups/newGroupModal/newGroupModal";
import useSWR from "swr";
import MainHeader from "@/components/app/mainHeader/mainHeader";
import {fetcher, smoothScroll} from "@/utils/globalFunctions";
import {GamesListHandle} from "@/components/app/groupMenu/games/gamesList";
import { MenuScrollContext } from "@/utils/MenuScrollContext";
import {AnimatePresence} from "framer-motion";
import Loader from "@/components/general/loader/loader";

export default function GroupsPageLayoutClient({children}: {children: React.ReactNode}) {
    const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState<boolean>(false);

    const containerRef = useRef<HTMLElement>(null);
    const menuRef = useRef<GamesListHandle>(null);
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
                menuRef.current?.enableScroll();
            } else {
                menuRef.current?.disableScroll();
            }
        });
    }, []);

    const { data: profile, isLoading, mutate: refreshProfile } = useSWR(
        '/api/user',
        (url) => fetcher(url, "Une erreur s'est produite en essayant de récuperer ton profil. Essaye de rafraîchir la page.")
    );

    return !isLoading ? (
        <div className={styles.mainPage}>
            <MainHeader profile={profile} refreshProfile={refreshProfile}/>

            <div className={styles.mainAppContainer}>
                <GroupsSidebar
                    groups={groupsList ?? []}
                    setModalState={setIsNewGroupModalOpen}
                />
                <MenuScrollContext.Provider value={menuRef}>
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
                </MenuScrollContext.Provider>
            </div>

            <AnimatePresence mode="wait">
                {isNewGroupModalOpen && (
                    <NewGroupModal
                        setModal={setIsNewGroupModalOpen}
                        refreshGroups={refreshGroups}
                    />
                )}
            </AnimatePresence>
        </div>
    ) : (
        <div className={styles.loaderContainer}>
            <Loader/>
        </div>
    );
}
