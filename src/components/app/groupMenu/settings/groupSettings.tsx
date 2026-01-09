import styles from "./groupSettings.module.scss";
import React, {forwardRef, useImperativeHandle, useMemo, useRef, useState} from "react";
import {GroupDetails} from "@/utils/types";
import {useToasts} from "@/utils/helpers/useToasts";
import {KeyedMutator} from "swr";
import MenuHeader from "@/components/app/groupMenu/menuHeader/menuHeader";
import SettingSection from "@/components/app/groupMenu/settings/settingSection/settingSection";
import DetailsSettings from "@/components/app/groupMenu/settings/settingSection/detailsSettings/detailsSettings";
import SubmitButtons from "@/components/app/userSettings/submitButtons/submitButtons";
import RightsSettings from "@/components/app/groupMenu/settings/settingSection/rightsSettings/rightsSettings";
import AccessSettings from "@/components/app/groupMenu/settings/settingSection/accessSettings/accessSettings";
import {getChangedRules} from "@/utils/globalFunctions";

export type GamesListHandle = {
    enableScroll: () => void;
    disableScroll: () => void;
    isAtTop: () => boolean;
};

interface MembersListProps {
    group: GroupDetails;
    refreshGroup: KeyedMutator<GroupDetails>;
    userHaveRights: boolean;
}

export const GroupSettings = forwardRef<GamesListHandle, MembersListProps>(({group, refreshGroup, userHaveRights}, ref) => {
    const settingsRef = useRef<HTMLDivElement>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const {successToast, errorToast} = useToasts();
    const [currentOption, setCurrentOption] = useState<string | null>(null);

    const defaultGroupSettingsForm = useMemo(() => ({
        avatar: group?.avatar,
        name: group?.name,
        description: group?.description,
        rules: group?.rules,
        access_mode: group?.access_mode
    }), [group]);
    const [groupSettingsForm, setGroupSettingsForm] = useState({...defaultGroupSettingsForm});

    useImperativeHandle(ref, () => ({
        enableScroll() {
            if (settingsRef.current) {
                settingsRef.current.style.overflowY = "scroll";
            }
        },
        disableScroll() {
            if (settingsRef.current) {
                settingsRef.current.style.overflowY = "hidden";
                settingsRef.current.scrollTop = 0;
            }
        },
        isAtTop() {
            return settingsRef.current?.scrollTop === 0;
        },
    }));

    const handleSubmit = () => {
        if (currentOption === "rules") {
            handleUpdateRules();
        } else {
            handleUpdateGroup();
        }
    }


    const handleUpdateGroup = async () => {
        const formData = new FormData();
        let hasChanges = false;

        // name
        if (groupSettingsForm.name && groupSettingsForm.name !== defaultGroupSettingsForm.name) {
            formData.append("name", groupSettingsForm.name);
            hasChanges = true;
        }

        // description
        if (groupSettingsForm.description !== defaultGroupSettingsForm.description) {
            formData.append("description", groupSettingsForm.description ?? "");
            hasChanges = true;
        }

        // name
        if (groupSettingsForm.access_mode && groupSettingsForm.access_mode !== defaultGroupSettingsForm.access_mode) {
            formData.append("accessMode", groupSettingsForm.access_mode);
            hasChanges = true;
        }

        // avatar
        const currentAvatar = groupSettingsForm.avatar;
        const defaultAvatar = defaultGroupSettingsForm.avatar;

        if (currentAvatar !== defaultAvatar) {
            if (currentAvatar instanceof File) {
                formData.append("avatarFile", currentAvatar);
                hasChanges = true;
            } else if (currentAvatar && defaultAvatar && currentAvatar.id !== defaultAvatar.id) {
                formData.append("avatarId", currentAvatar.id);
                hasChanges = true;
            }
        }

        if (!hasChanges) return;

        if (!group?.id) {
            errorToast('Impossible de récupérer les informations de ton groupe.')
            return;
        }
        formData.append("groupId", group.id)

        try {
            const res = await fetch("/api/groups", {
                method: "PUT",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'avatar_create_failed':
                        errorToast("Une erreur est survenue lors de l'ajout de ton avatar.");
                        break;
                    case 'group_update_failed':
                        errorToast("Une erreur est survenue lors de la mise à jour des informations de ton groupe.");
                        break;
                    default:
                        errorToast("Une erreur est survenue. Si le problème persiste, contacte le support.");
                }
                return;
            }

            if (data.success) {
                successToast("Tes modifications ont bien été prises en compte.");
                await refreshGroup();
                setIsSaveModalOpen(false);
            }
        } catch (err) {
            errorToast('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    };

    const handleUpdateRules = async () => {
        if (!groupSettingsForm.rules || !defaultGroupSettingsForm.rules) return;

        const changedRules = getChangedRules(
            groupSettingsForm.rules,
            defaultGroupSettingsForm.rules
        );

        try {
            const res = await fetch("/api/groups/rules", {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId: group?.id,
                    rules: changedRules
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    default:
                        errorToast("Une erreur est survenue. Si le problème persiste, contacte le support.");
                }
                return;
            }

            if (data.success) {
                successToast("Tes modifications ont bien été prises en compte.");
                await refreshGroup();
                setIsSaveModalOpen(false);
            }
        } catch (err) {
            errorToast('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    }


    const handleReset = () => {
        setGroupSettingsForm({...defaultGroupSettingsForm});
        setIsSaveModalOpen(false);
    }

    return (
        <>
            <MenuHeader title={"Paramètres de groupe"}/>

            <div className={styles.settingsContainerGlobal}>
                <div ref={settingsRef} className={styles.settingsContainer}>
                    <SettingSection
                        title={"Personnalisation"}
                        code={"details"}
                        isSectionOpen={currentOption === "details"}
                        setOptionsOpen={setCurrentOption}
                    >
                        <DetailsSettings
                            groupSettingsForm={groupSettingsForm}
                            setGroupSettingsForm={setGroupSettingsForm}
                            defaultGroupSettingsForm={defaultGroupSettingsForm}
                            setIsSaveModalOpen={setIsSaveModalOpen}
                            isDisabled={!userHaveRights}
                        />
                    </SettingSection>

                    <SettingSection
                        title={"Permissions"}
                        code={"rules"}
                        isSectionOpen={currentOption === "rules"}
                        setOptionsOpen={setCurrentOption}
                    >
                        <RightsSettings
                            groupSettingsForm={groupSettingsForm}
                            setGroupSettingsForm={setGroupSettingsForm}
                            defaultGroupSettingsForm={defaultGroupSettingsForm}
                            setIsSaveModalOpen={setIsSaveModalOpen}
                            isDisabled={!userHaveRights}
                        />
                    </SettingSection>

                    <SettingSection
                        title={"Accès et invitations"}
                        code={"access"}
                        isSectionOpen={currentOption === "access"}
                        setOptionsOpen={setCurrentOption}
                    >
                        <AccessSettings
                            groupSettingsForm={groupSettingsForm}
                            setGroupSettingsForm={setGroupSettingsForm}
                            defaultGroupSettingsForm={defaultGroupSettingsForm}
                            setIsSaveModalOpen={setIsSaveModalOpen}
                            isDisabled={!userHaveRights}
                            group={group}
                            refreshGroup={refreshGroup}
                        />
                    </SettingSection>
                </div>

                <div className={styles.submitContainer}>
                    <SubmitButtons
                        displayButtons={isSaveModalOpen}
                        handleReset={handleReset}
                        handleSubmit={handleSubmit}
                        withBackground={true}
                    />
                </div>
            </div>
        </>
    )
});

GroupSettings.displayName = "GroupSettings";