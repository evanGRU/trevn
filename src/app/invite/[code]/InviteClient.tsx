"use client";

import {useParams, useRouter} from "next/navigation";
import styles from "./page.module.scss";
import {AnimatePresence, motion} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {useToasts} from "@/utils/helpers/useToasts";
import React, {useEffect, useState} from "react";
import {Group} from "@/utils/types";
import {DbImage} from "@/components/general/dbImage/dbImage";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import GlassButton from "@/components/general/glassButton/glassButton";

export default function InvitePageClient() {
    const {code} = useParams();
    const {errorToast, successToast} = useToasts();
    const [group, setGroup] = useState<Group>();
    const router = useRouter();

    useEffect(() => {
        const fetchGroup = async () => {
            if (!code) return;

            try {
                const res = await fetch(`/api/groups/${code}`);
                const data = await res.json();

                if (!res.ok && data) {
                    errorToast("Impossible de récupérer les infos du groupe.")
                }

                setGroup(data);
            } catch (e) {
                console.error(e);
                errorToast('Une erreur s\'est produite')
            }
        }
        
        fetchGroup();
    }, [code]);

    const handleJoinGroup = async () => {
        try {
            const res = await fetch('/api/groups/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            })
            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    default:
                        errorToast(`Impossible de rejoindre le groupe ${group?.name}.`);
                        router.replace("/groups");
                        break;
                }
                return;
            }

            successToast(`Tu as bien rejoint le groupe ${group?.name}!`);
            router.replace(`/groups/${data.groupId}`);
        } catch (err) {
            errorToast("Une erreur s'est produite.");
        }
    };

    return group && (
        <>
            <div className={styles.invitePage}>
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={styles.inviteContainer}
                    >
                        <div className={styles.headerContainer}>
                            <Link href={"/groups"}>
                                <Image
                                    src="/logo/logotype_empty.svg"
                                    alt="Logotype Trevn"
                                    width={80}
                                    height={50}
                                />
                            </Link>
                            <div className={styles.headerTitle}>
                                <h1>{"Invitation à un groupe"}</h1>
                            </div>
                        </div>

                        <div className={styles.groupContainer}>
                            <p>Tu as été invité à rejoindre : </p>
                            <div className={styles.groupCardContainer}>
                                <DbImage
                                    src={getPublicAvatarUrl(group?.avatar.type, group?.avatar.name)}
                                    alt="Group avatar"
                                    width={100}
                                    height={100}
                                />
                                <h3>{group?.name}</h3>
                            </div>
                        </div>

                        <div className={styles.formQuestionContainer}>
                            <h2>Veux-tu rejoindre le groupe ?</h2>

                            <div className={styles.buttonsContainer}>
                                <button
                                    type={"button"}
                                    className={styles.cancelButton}
                                    onClick={() => router.replace('/groups')}
                                >
                                    Annuler
                                </button>
                                <span className={styles.submitButton}>
                                        <GlassButton type={"button"} handleClick={() => handleJoinGroup()}>{"Accepter"}</GlassButton>
                                    </span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
}
