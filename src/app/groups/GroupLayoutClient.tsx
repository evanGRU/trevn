"use client";

import styles from "./page.module.scss";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import GroupsSidebar from "@/components/app/groups/groupsSidebar/groupsSidebar";
import NewGroupModal from "@/components/app/groups/newGroupModal/newGroupModal";
import MainHeader from "@/components/app/mainHeader/mainHeader";
import {smoothScroll} from "@/utils/globalFunctions";
import {GamesListHandle} from "@/components/app/groupMenu/games/gamesList";
import { MenuScrollContext } from "@/utils/MenuScrollContext";
import {AnimatePresence} from "framer-motion";
import Loader from "@/components/general/loader/loader";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useToasts} from "@/utils/helpers/useToasts";
import {useSWRWithError} from "@/utils/helpers/useSWRWithError";
import {Group, Profile} from "@/utils/types";

export default function GroupsPageLayoutClient({children}: {children: React.ReactNode}) {
    const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState<boolean>(false);
    const { groupId } = useParams();

    const containerRef = useRef<HTMLElement>(null);
    const menuRef = useRef<GamesListHandle>(null);
    const isScrollingRef = useRef(false);
    const atBottomRef = useRef(false);

    const searchParams = useSearchParams();
    const { errorToast } = useToasts();
    const router = useRouter();

    useEffect(() => {
        const toast = searchParams.get("toast");
        if (!toast) return;

        switch (toast) {
            case "invalid_invite":
                errorToast("Ton lien d’invitation est invalide ou a expiré.");
                router.replace("/groups");
                break;
            case "group_not_found":
                errorToast("Il semblerait que ce groupe n'existe pas.");
                router.replace("/groups");
                break;
            case "cant_access":
                errorToast("Tu ne fais pas partie de ce groupe.");
                router.replace("/groups");
                break;
            case "group_close":
                errorToast("Ce groupe est fermé, tu ne peux pas le rejoindre.");
                router.replace("/groups");
                break;
        }
    }, [searchParams]);

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
        }, 300);
    }, []);

    const {
        data: groupsList,
        isLoading: groupsLoading,
        mutate: refreshGroups,
    } = useSWRWithError<Group[]>("/api/groups", {
        errorMessage: "Impossible de récupérer la liste des groupes",
    });

    const {
        data: profile,
        isLoading: profileLoading,
        mutate: refreshProfile,
    } = useSWRWithError<Profile>("/api/user", {
        errorMessage: "Une erreur s'est produite en essayant de récupérer ton profil.",
    });

    // const {
    //     data: gamesWithLikes,
    //     isLoading: gamesWithLikesLoading,
    // } = useSWRWithError<GameCapsuleData[]>("/api/games/leaderboard", {
    //     errorMessage: "Une erreur s'est produite en essayant de récupérer le classement des jeux les plus likés.",
    // });

    return (!groupsLoading && !profileLoading && profile) ? (
        <div className={styles.mainPage}>
            <MainHeader profile={profile} refreshProfile={refreshProfile}/>

            <div className={styles.mainAppContainer}>
                <GroupsSidebar
                    groups={groupsList ?? []}
                    setModalState={setIsNewGroupModalOpen}
                />
                <MenuScrollContext.Provider value={menuRef}>
                    <main ref={containerRef} className={`mainContainer ${styles.mainContentContainer}`} onScroll={handleScroll}>
                        {groupsList?.length === 0 && (
                            <div className={styles.noGroupsContainer}>
                                <h1>C’est un peu vide ici…</h1>
                                <p>Crée ton premier groupe !</p>

                                <DefaultButton handleClick={() => setIsNewGroupModalOpen(true)}>
                                    <Image src="/icons/plus.svg" width={20} height={20} alt="Plus icon" />
                                    Nouveau groupe
                                </DefaultButton>
                            </div>
                        )}

                        {groupsList && groupsList.length > 0 && (
                            groupId ? (children) : (
                                <div className={styles.noGroupsContainer}>
                                    <h1>Bienvenue sur Trevn {profile.username} !</h1>
                                    <p>Retrouve ici, prochainement, le classement des jeux les plus likés par les utilisateurs et bien plus encore...</p>
                                </div>
                            )
                        )}
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
