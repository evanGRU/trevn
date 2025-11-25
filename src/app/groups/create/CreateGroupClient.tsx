"use client"

import styles from "./page.module.scss";
import NavbarApp from "@/components/homepage/navbarApp/navbarApp";
import {useState} from "react";
import {User} from "@supabase/auth-js";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";
import { nanoid } from "nanoid";

type Profile = {
    username: string;
    avatar_url: string | null;
};

type NewGroupForm = {
    name: string;
    description: string;
};

export default function CreateGroupClient({ profile, user }: {profile: Profile | null, user: User}) {
    const supabase = createClient();
    const [newGroupForm, setNewGroupForm] = useState<NewGroupForm>({
        name: "",
        description: ""
    });
    const router = useRouter();
    const inviteCode = nanoid(10);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        const groupToInsert = {
            name: newGroupForm.name,
            created_by: user.id,
            description: newGroupForm.description || null,
            invite_code: inviteCode
        };

        const { data: groupData, error: groupError } = await supabase
            .from("groups")
            .insert(groupToInsert)
            .select("id")
            .single();

        if (groupError) {
            console.error("Erreur création groupe :", groupError);
            return;
        }

        const { error: linkError } = await supabase
            .from("groups_members")
            .insert({
                group_id: groupData.id,
                user_id: user.id
            });

        if (linkError) {
            console.error("Erreur ajout user au groupe :", linkError);
            return;
        }

        router.push('/home');
    };

    return (
        <div className={styles.createGroupPage}>
            <NavbarApp profile={profile}/>

            <div className={styles.createGroupContainer}>
                <h1>Créer un nouveau groupe</h1>

                <form onSubmit={handleCreate}>
                    <div className={styles.customInput}>
                        <label htmlFor="name">Nom du groupe</label>
                        <input
                            type="text"
                            name="name"
                            value={newGroupForm.name}
                            onChange={(e) =>
                                setNewGroupForm({
                                    ...newGroupForm,
                                    name: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className={styles.customInput}>
                        <label htmlFor="description">Description du groupe</label>
                        <textarea
                            name="description"
                            value={newGroupForm.description}
                            onChange={(e) =>
                                setNewGroupForm({
                                    ...newGroupForm,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <button type="submit">Créer un groupe</button>
                </form>
            </div>
        </div>
    )
}
