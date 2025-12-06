"use client"

import styles from "./page.module.scss";
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import GroupsList from "@/components/app/groupsList/groupsList";

type Profile = {
    id: string;
    username: string;
    avatar_url: string | null;
} | null;

type Group = {
    id: string;
    name: string;
    description: string | null;
    invite_code: string;
    created_at: string;
    created_by: string;
};

export default function GroupPageClient({ profile }: {profile: Profile}) {
    const supabase = createClient();
    const [groupsList, setGroupsList] = useState<Group[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            const { data, error } = await supabase
                .from("groups")
                .select(`
                    *,
                    groups_members!inner (
                        user_id
                      )
                `)
                .eq("groups_members.user_id", profile?.id);

            if (error) {
                console.error("Erreur fetch groups:", error);
                return;
            }

            setGroupsList(data);
        };

        fetchGroups();
    }, [profile]);

    return (
        <div className={styles.mainPage}>
            <div className={styles.mainHeader}>
                <Link href={"/groups"}>
                    <Image
                        src="/logo/logotype_empty.svg"
                        alt="Logotype Trevn"
                        width={60}
                        height={36}
                    />
                </Link>

                <div className={styles.profileContainer}>
                    <div className={styles.usernameContainer}>
                        <Image
                            src={getPublicAvatarUrl(profile?.avatar_url)}
                            alt={"Avatar"}
                            width={28}
                            height={28}
                            className={styles.pp}
                        />
                        <p>{profile?.username}</p>
                    </div>

                    <div className={`glassButtonGlobal ${styles.glassIconButton}`}>
                        <Image
                            src="/icons/gear.svg"
                            alt="Icône des paramètres"
                            width={24}
                            height={24}
                        />
                    </div>

                    <div className={`glassButtonGlobal ${styles.glassIconButton}`}>
                        <Image
                            src="/icons/signout.svg"
                            alt="Icône de déconnexion"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.mainAppContainer}>
                <GroupsList/>

                <div className={styles.groupContainer}>
                    {groupsList.length === 0 ? (
                        <div className={styles.noGroupsContainer}>
                            <h1>C’est un peu vide ici…</h1>
                            <p>Crée ton premier groupe, propose des jeux et découvre ceux qui font vibrer tes potes.</p>

                            <DefaultButton handleClick={() => alert('open new group modal')}>
                                <Image
                                    src="/icons/plus.svg"
                                    alt="Icône de tri"
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
        </div>
    )
}
