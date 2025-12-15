"use client";

import styles from "./page.module.scss";
import {useCallback, useRef, useState} from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import GroupsSidebar from "@/components/app/groupsSidebar/groupsSidebar";
import NewGroupModal from "@/components/app/newGroupModal/newGroupModal";
import useSWR from "swr";
import { useToasts } from "@/utils/useToasts";
import {Group, Profile} from "@/utils/types";
import MainHeader from "@/components/app/mainHeader/mainHeader";
import {smoothScroll} from "@/utils/globalFunctions";
import {GamesListHandle} from "@/components/app/gamesList/gamesList";
import { GamesScrollContext } from "@/utils/GamesScrollContext";

export default function GroupsPageLayoutClient({profile, children}: { profile: Profile, children: React.ReactNode}) {
    const supabase = createClient();
    const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState<boolean>(false);
    const {errorToast} = useToasts();

    const containerRef = useRef<HTMLElement>(null);
    const gamesListRef = useRef<GamesListHandle>(null);
    const isScrollingRef = useRef(false);
    const atBottomRef = useRef(false);

    const fetchGroups = async (userId: string): Promise<Group[]> => {
        const { data, error } = await supabase
            .from("groups")
            .select(`
                id, name,
                avatar:avatars!avatar_id(id, name, type),
                groups_members!inner(user_id)
            `)
            .eq("groups_members.user_id", userId);

        if (error) {
            errorToast('Une erreur a eu lieu lors de la récupération des groupes. Essayer de rafraîchir la page.');
            throw error;
        }
        return (data ?? []).map(g => ({
            ...g,
            avatar: Array.isArray(g.avatar) ? g.avatar[0] ?? null : g.avatar
        }));
    };

    const { data: groupsList, mutate: refreshGroups } = useSWR<Group[]>(
        profile?.id ? ["groups", profile.id] : null,
        () => fetchGroups(profile!.id)
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
                    user={profile}
                    setModal={setIsNewGroupModalOpen}
                    refreshGroups={refreshGroups}
                />
            )}
        </div>
    );
}
