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

export default function GroupDetailsClient({profile} : {profile: ProfileDefault}) {
    const { groupId } = useParams();
    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>("games")
    const mainScrollRef = useMenuScroll();

    const searchParams = useSearchParams();
    const { successToast } = useToasts();
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
                </ul>
            </nav>

            <div className={styles.groupSelectedContent}>
                {getSelectedMenuContent()}
            </div>
        </>
    ) : (
        <Loader/>
    );
}
