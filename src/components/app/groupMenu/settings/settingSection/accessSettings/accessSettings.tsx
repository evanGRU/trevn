import styles from "./accessSettings.module.scss";
import React, {useState} from "react";
import {GroupDetails, GroupDetailsForm} from "@/utils/types";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import InvitationField from "@/components/app/groupMenu/members/inviteMemberModal/invitationField/invitationField";
import {nanoid} from "nanoid";
import {KeyedMutator} from "swr";
import {useToasts} from "@/utils/helpers/useToasts";

interface DetailsSettingsProps {
    groupSettingsForm: GroupDetailsForm;
    setGroupSettingsForm: React.Dispatch<React.SetStateAction<GroupDetailsForm>>;
    defaultGroupSettingsForm: GroupDetailsForm;
    setIsSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDisabled: boolean;
    group: GroupDetails;
    refreshGroup: KeyedMutator<GroupDetails>;
}

export default function AccessSettings({groupSettingsForm, setGroupSettingsForm, defaultGroupSettingsForm, setIsSaveModalOpen, isDisabled, group, refreshGroup}: DetailsSettingsProps) {
    const [isRegenerateLoading, setIsRegenerateLoading] = useState(false);
    const {successToast, errorToast} = useToasts();

    const handleUpdateAccessMode = (newAccessMode: string) => {
        setGroupSettingsForm((prev) => {
            const updatedForm = {
                ...prev,
                access_mode: newAccessMode
            };

            const hasChanges = JSON.stringify(updatedForm) !== JSON.stringify(defaultGroupSettingsForm);
            setIsSaveModalOpen(hasChanges);

            return updatedForm;
        });
    }

    const handleRegenerateCode = async () => {
        if (isRegenerateLoading) return;
        setIsRegenerateLoading(true);

        const newCode = nanoid(10);
        try {
            const res = await fetch('/api/groups/newCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId: group?.id,
                    newCode
                }),
            })

            if (!res.ok) {
                errorToast("Erreur lors de la regénération de ton code d'invitation.")
                return;
            }

            successToast("Ton code d'invitation à été regénéré.")
            await refreshGroup();
        } catch (err) {
            errorToast('Une erreur est survenue.');
        } finally {
            setIsRegenerateLoading(false);
        }

    }

    return (
        <div className={styles.accessSettingContainer}>
            <div className={styles.accessSettingContainer}>
                <div>
                    <h4>Mode d&apos;accès</h4>
                    <p className={"groupSettingSubtitle"}>Définissez comment les utilisateurs peuvent rejoindre ton groupe.</p>
                </div>

                <div className={styles.accessModesContainer}>

                    <button
                        type={"button"}
                        className={`
                            ${styles.accessModeCard} 
                            ${groupSettingsForm?.access_mode === "open" ? styles.accessModeCardActive : ""}
                        `}
                        onClick={() => handleUpdateAccessMode("open")}
                    >
                        <p className={styles.cardTitle}>Sur invitation</p>
                        <p className={styles.cardDescription}>Entrée libre avec lien ou code d’invitation.</p>
                    </button>

                    <button
                        type={"button"}
                        className={`
                            ${styles.accessModeCard} 
                            ${groupSettingsForm?.access_mode === "closed" ? styles.accessModeCardActive : ""}
                        `}
                        onClick={() => handleUpdateAccessMode("closed")}
                    >
                        <p className={styles.cardTitle}>Fermé</p>
                        <p className={styles.cardDescription}>Aucun nouvel utilisateur ne peut rejoindre le groupe.</p>
                    </button>

                    {/*<button
                        type={"button"}
                        className={`
                            ${styles.accessModeCard} 
                            ${accessMode === "moderate" ? styles.accessModeCardActive : ""}
                            ${styles.isDisabled}
                        `}
                        onClick={() => setAccessMode("moderate")}
                        disabled={true}
                    >
                        <p className={styles.cardTitle}>Accès modéré</p>
                        <p className={styles.cardDescription}>Rejoindre le groupe nécessite une validation manuelle.</p>
                    </button>*/}
                </div>
            </div>

            <div className={styles.accessSettingContainer}>
                <div>
                    <h4>Code d&apos;invitation</h4>
                    <p className={"groupSettingSubtitle"}>Partage ce code pour permettre à d’autres utilisateurs de rejoindre ton groupe.</p>
                </div>

                <div className={styles.invitationCodeContainer}>
                    <div className={styles.invitationCode}>
                        <p>Code : </p>
                        <InvitationField text={group?.invite_code} type={'code'}/>
                    </div>

                    <div className={styles.regenButtonContainer}>
                        <DefaultButton handleClick={() => handleRegenerateCode()}>Générer un nouveau code d&apos;invitation</DefaultButton>
                    </div>
                </div>
            </div>
        </div>
    )
}