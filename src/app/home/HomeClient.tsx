"use client"

import styles from "./page.module.scss";
import NavbarApp from "@/components/homepage/navbarApp/navbarApp";
import Link from "next/link";
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {User} from "@supabase/auth-js";
import {useRouter} from "next/navigation";

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

export default function HomeClient({ profile, user }: {profile: Profile | null, user: User}) {
    const supabase = createClient();
    const [groupsList, setGroupsList] = useState<Group[]>([]);
    const router = useRouter();

    const fetchGroups = async () => {
        const { data, error } = await supabase
            .from("groups")
            .select(`
                *,
                groups_members!inner (
                    user_id
                  )
            `)
            .eq("groups_members.user_id", user.id);

        if (error) {
            console.error("Erreur fetch groups:", error);
            return;
        }

        setGroupsList(data);
    };

    useEffect(() => {
        fetchGroups();
    }, [user]);

    return (
        <div className={styles.homePage}>
            <NavbarApp profile={profile}/>

            <div className={styles.homeContainer}>
                <h1>LISTE des groupes</h1>
                <div className={styles.listContainer}>
                    <h2>Tous vos groupes</h2>
                    <div className={styles.list}>
                        {groupsList?.map((group: Group | null) => (
                            <div
                                key={group?.id}
                                className={styles.card}
                                onClick={() => router.push(`/groups/${group?.id}`)}
                            >
                                <h3>{group?.name}</h3>
                                <p>{group?.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <Link href={"/groups/create"}>Créer un groupe</Link>
                    <Link href={"/groups/join"}>Rejoindre un groupe</Link>
                </div>
            </div>
        </div>
    )
}
