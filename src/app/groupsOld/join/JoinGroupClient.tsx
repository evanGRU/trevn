"use client"

import styles from "./page.module.scss";
import NavbarApp from "@/components/homepage/navbarApp/navbarApp";
import {User} from "@supabase/auth-js";
import {useRouter} from "next/navigation";
import {useState} from "react";

type Profile = {
    username: string;
    avatar_url: string | null;
};

export default function JoinGroupClient({ profile }: {profile: Profile | null, user: User}) {
    const router = useRouter();
    const [message, setMessage] = useState("");

    const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get("groupCode") as string;

        const res = await fetch("/api/groups/join", {
            method: "POST",
            body: JSON.stringify({ code }),
        });

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
            setMessage(data.error);
        } else {
            router.push(`/groups/${data.groupId}`);
        }
    };

    return (
        <div className={styles.joinGroupPage}>
            <NavbarApp profile={profile}/>

            <div className={styles.joinGroupContainer}>
                <h1>Créer un nouveau groupe</h1>

                <form onSubmit={handleJoin}>
                    <div className={styles.customInput}>
                        <label htmlFor="groupCode">Code</label>
                        <input
                            type="text"
                            name="groupCode"
                        />
                    </div>

                    <button type="submit">Rejoindre un groupe</button>
                    {message && <p style={{ color: "red" }}>{message}</p>}
                </form>
            </div>
        </div>
    )
}
