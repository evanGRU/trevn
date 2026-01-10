"use client";

import {useParams, useRouter, useSearchParams} from "next/navigation";
import {GroupDetails, Member, ProfileDefault, SelectedMenu} from "@/utils/types";
import styles from "./page.module.scss";
import {DbImage} from "@/components/general/dbImage/dbImage";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import React, {useEffect, useState} from "react";
import {GamesList} from "@/components/app/groupMenu/games/gamesList";
import {useMenuScroll} from "@/utils/MenuScrollContext";
import {MembersList} from "@/components/app/groupMenu/members/membersList";
import Loader from "@/components/general/loader/loader";
import {GroupSettings} from "@/components/app/groupMenu/settings/groupSettings";
import {useToasts} from "@/utils/helpers/useToasts";
import {useSWRWithError} from "@/utils/helpers/useSWRWithError";
import DeleteModal from "@/components/general/deleteModal/deleteModal";
import {AnimatePresence} from "framer-motion";

export default function GroupDetailsClient({profile} : {profile: ProfileDefault}) {
    const { groupId } = useParams();
    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>("games")
    const mainScrollRef = useMenuScroll();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const {successToast, errorToast} = useToasts();

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const toast = searchParams.get("toast");
        if (!toast) return;


        switch (toast) {
            case "already_member":
                successToast("Tu fais déjà partie de ce groupe !");
                router.replace(`/groups/${groupId}`);
                break;
        }
    }, [searchParams]);

    const {
        data: group,
        isLoading: groupIsLoading,
        mutate: refreshGroup,
    } = useSWRWithError<GroupDetails>(`/api/groups/detail?groupId=${groupId}`, {
        errorMessage: "Une erreur s'est produite en essayant de récupérer les infos de ce groupe.",
        redirectTo: "/groups",
    });

    const {
        data: members,
        isLoading: membersAreLoading,
        mutate: refreshMembers,
    } = useSWRWithError<Member[]>(`/api/groups/members?groupId=${groupId}`, {
        errorMessage: "Une erreur s'est produite en essayant de récupérer la liste des membres de ce groupe.",
    });

    const userHaveRights = members?.find((member: Member) => member.id === profile?.id)?.role === "owner";

    const getSelectedMenuContent = () => {
        if (!group || !members) return;

        switch (selectedMenu) {
            case "games":
                return (
                    <GamesList
                        ref={mainScrollRef}
                        group={group}
                        members={members}
                        userHaveRights={userHaveRights}
                    />);
            case "members":
                return (
                    <MembersList
                        ref={mainScrollRef}
                        members={members}
                        profile={profile}
                        refreshMembers={refreshMembers}
                        group={group}
                        userHaveRights={userHaveRights}
                    />
                );
            case "settings":
                return (
                    <GroupSettings
                        ref={mainScrollRef}
                        group={group}
                        refreshGroup={refreshGroup}
                        userHaveRights={userHaveRights}
                    />
                );
        }
    }

    const handleLeaveGroup = async () => {
        try {
            const res = await fetch('/api/groups/leave', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId: group?.id,
                }),
            })

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'not_member':
                        errorToast('Tu ne fais pas partie de ce groupe.')
                        break
                    default:
                        errorToast("Une erreur est survenue au moment de quitter ce groupe.");
                }
                return;
            }

            setIsDeleteModalOpen(false);
            successToast(`Tu as quitté le groupe ${group?.name}.`)
            router.replace("/groups");
        } catch (err) {
            console.error(err);
            errorToast('Une erreur est survenue.');
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetch('/api/groups/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId: group?.id,
                }),
            })

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'group_not_found':
                        errorToast('Tu ne peux pas supprimer ce groupe car il n\'existe pas.')
                        break
                    case 'not_owner':
                        errorToast('Tu n\'as pas les droits pour supprimer ce groupe.')
                        break
                    default:
                        errorToast("Une erreur est survenue au moment de supprimer ce groupe.");
                }
                return;
            }

            setIsDeleteModalOpen(false);
            successToast(`Ton groupe ${group?.name} a bien été supprimé.`)
            router.replace("/groups");
        } catch (err) {
            console.error(err);
            errorToast('Une erreur est survenue.');
        }
    }

    return (!groupIsLoading && !membersAreLoading) ? (
        <>
            <div className={styles.groupDetailsSection}>
                <div className={styles.groupDetailsContainer}>
                    <DbImage
                        src={getPublicAvatarUrl(group?.avatar.type, group?.avatar.name)}
                        alt={"Avatar group"}
                        width={120}
                        height={120}
                    />
                    <div className={styles.groupDetailsContent}>
                        <h1>{group?.name}</h1>
                        <p>
                            {group?.description}
                        </p>
                    </div>
                </div>
            </div>

            <nav className={styles.groupNavbarSection}>
                <ul>
                    <div className={styles.selectButtons}>
                        <li
                            onClick={() => setSelectedMenu("games")}
                            className={`${selectedMenu === "games" ? styles.selectedMenu : ""}`}
                        >
                            Jeux
                        </li>
                        <li
                            onClick={() => setSelectedMenu("members")}
                            className={`${selectedMenu === "members" ? styles.selectedMenu : ""}`}
                        >
                            Membres
                        </li>
                        <li
                            onClick={() => setSelectedMenu("settings")}
                            className={`${selectedMenu === "settings" ? styles.selectedMenu : ""}`}
                        >
                            Paramètres
                        </li>
                    </div>

                    <li
                        onClick={() => setIsDeleteModalOpen(true)}
                        className={styles.leaveButton}
                    >
                        {userHaveRights ? "Supprimer le groupe" : "Quitter le groupe" }
                    </li>
                </ul>
            </nav>

            <div className={styles.groupSelectedContent}>
                {getSelectedMenuContent()}
            </div>

            <AnimatePresence mode={"wait"}>
                {isDeleteModalOpen && (
                    <DeleteModal
                        setModal={setIsDeleteModalOpen}
                        closeIconTopPosition={userHaveRights ? "240px" : "164px"}
                        handleDelete={userHaveRights ? handleDelete : handleLeaveGroup}
                        withInput={userHaveRights}
                        deleteLabel={'Si tu es certain de ta décision, saisis “SUPPRIMER” pour continuer.'}
                        leaveButtonText={userHaveRights ? "Supprimer le groupe" : "Quitter le groupe"}
                    >
                        {userHaveRights ? (
                            <>
                                <h1>Supprimer un groupe</h1>
                                <p>
                                    <span className="boldText">Attention : </span>
                                    supprimer ce groupe entraînera la <span className="boldText"> suppression définitive </span> de tous les jeux, des likes et
                                    de l’ensemble des données associées. Le groupe disparaîtra immédiatement pour tous les membres.
                                    <span className="boldText"> Aucune récupération ne sera possible.</span>
                                </p>

                                <h4>Es-tu sûr de vouloir supprimer ce groupe?</h4>
                            </>
                        ) : (
                            <>
                                <h1>Quitter un groupe</h1>
                                <p>
                                    Quitter ce groupe te fera perdre immédiatement l’accès à son contenu.
                                    Les jeux que tu as ajouté resteront mais tes likes seront supprimés.
                                    Pour revenir dans le groupe tu devras être réinvité par un membre.
                                </p>
                            </>
                        )}
                    </DeleteModal>
                )}
            </AnimatePresence>
        </>
    ) : (
        <Loader/>
    );
}
