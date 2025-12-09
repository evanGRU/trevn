"use client"

import styles from "./page.module.scss";
import {useState} from "react";
import {createClient} from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import GroupsList from "@/components/app/groupsList/groupsList";
import NewGroupModal from "@/components/app/newGroupModal/newGroupModal";
import {signout} from "@/utils/auth";
import useSWR from "swr";
import {useAuthToast} from "@/utils/useAuthToast";
import {Group, Profile} from "@/utils/types";
import {DbImage} from "@/utils/dbImage/dbImage";

export default function GroupPageClient({ profile }: {profile: Profile}) {
    const supabase = createClient();
    const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState<boolean>(false);
    const {errorToast} = useAuthToast();

    const fetchGroups = async (userId: string): Promise<Group[]> => {
        const { data, error } = await supabase
            .from("groups")
            .select(`
            id, name, description, invite_code,
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

    return (
        <div className={styles.mainPage}>
            <div className={styles.mainHeader}>
                <Link href={"/groups"}>
                    <Image
                        src="/logo/logotype_empty.svg"
                        alt="Logotype"
                        width={60}
                        height={36}
                    />
                </Link>

                <div className={styles.profileContainer}>
                    <div className={styles.usernameContainer}>
                        <DbImage
                            src={getPublicAvatarUrl("users", profile?.avatar_url)}
                            alt={"Avatar"}
                            width={28}
                            height={28}
                            className={styles.pp}
                        />
                        <p>{profile?.username}</p>
                    </div>

                    <button
                        type={"button"}
                        className={`glassButtonGlobal ${styles.glassIconButton}`}
                    >
                        <Image
                            src="/icons/gear.svg"
                            alt="Icône paramètres"
                            width={24}
                            height={24}
                        />
                    </button>

                    <button
                        type={"button"}
                        className={`glassButtonGlobal ${styles.glassIconButton}`}
                        onClick={() => signout()}
                    >
                        <Image
                            src="/icons/signout.svg"
                            alt="Icône déconnexion"
                            width={24}
                            height={24}
                        />
                    </button>
                </div>
            </div>

            <div className={styles.mainAppContainer}>
                <GroupsList
                    groups={groupsList ?? []}
                    setModalState={setIsNewGroupModalOpen}
                />

                <div className={styles.groupContainer}>
                    {groupsList?.length === 0 ? (
                        <div className={styles.noGroupsContainer}>
                            <h1>C’est un peu vide ici…</h1>
                            <p>Crée ton premier groupe, propose des jeux et découvre ceux qui font vibrer tes potes.</p>

                            <DefaultButton handleClick={() => setIsNewGroupModalOpen(true)}>
                                <Image
                                    src="/icons/plus.svg"
                                    alt="Icône ajout"
                                    width={20}
                                    height={20}
                                />
                                Nouveau groupe
                            </DefaultButton>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>

            {isNewGroupModalOpen &&
                <NewGroupModal
                    user={profile}
                    setModal={setIsNewGroupModalOpen}
                    refreshGroups={refreshGroups}
                />}
        </div>
    )
}
