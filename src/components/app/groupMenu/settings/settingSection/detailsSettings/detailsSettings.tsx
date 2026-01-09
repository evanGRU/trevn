import styles from "./detailsSettings.module.scss";
import React, {useEffect, useState} from "react";
import {Avatar, GroupDetailsForm} from "@/utils/types";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import {DbImage} from "@/components/general/dbImage/dbImage";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import {useToasts} from "@/utils/helpers/useToasts";

interface DetailsSettingsProps {
    groupSettingsForm: GroupDetailsForm;
    setGroupSettingsForm: React.Dispatch<React.SetStateAction<GroupDetailsForm>>;
    defaultGroupSettingsForm: GroupDetailsForm;
    setIsSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDisabled: boolean
}
export default function DetailsSettings({groupSettingsForm, setGroupSettingsForm, defaultGroupSettingsForm, setIsSaveModalOpen, isDisabled}: DetailsSettingsProps) {
    const {errorToast} = useToasts();

    const defaultAvatarUrl = groupSettingsForm?.avatar?.name;
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    const [avatarsPresets, setAvatarsPresets] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

    useEffect(() => {
        const fetchAvatarsPresets = async () => {
            try {
                const res = await fetch("/api/avatars/presets");
                const data = await res.json();

                if (!res.ok && data) {
                    errorToast("Impossible de récupérer les avatars prédéfinis.");
                }

                setAvatarsPresets(data);
            } catch (e) {
                console.error(e);
                errorToast('Une erreur s\'est produite');
            }
        }

        fetchAvatarsPresets();
    }, []);

    useEffect(() => {
        if (JSON.stringify(groupSettingsForm) === JSON.stringify(defaultGroupSettingsForm)) {
            setPreviewAvatarUrl(null);
            setSelectedAvatar(null);
        }
    }, [groupSettingsForm, defaultGroupSettingsForm]);

    const handleChangeGroupProp = (key: string, value: any) => {
        setGroupSettingsForm((prev) => {
            const updatedForm = {
                ...prev,
                [key]: value
            };

            const hasChanges = JSON.stringify(updatedForm) !== JSON.stringify(defaultGroupSettingsForm);
            setIsSaveModalOpen(hasChanges);

            return updatedForm;
        });
    }

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedAvatar(null);
        setPreviewAvatarUrl(URL.createObjectURL(file));

        handleChangeGroupProp("avatar", file);
        setIsSaveModalOpen(true);
    }

    const handleSelectAvatar = (avatar: Avatar) => {
        if (avatar.id === groupSettingsForm.avatar?.id) return;

        setPreviewAvatarUrl(null);
        setSelectedAvatar(avatar);

        handleChangeGroupProp("avatar", avatar);
        setIsSaveModalOpen(avatar.id !== defaultGroupSettingsForm.avatar?.id);
    }

    return (
        <div className={styles.detailsSettingContainer}>
            <div className={styles.detailsTextContainer}>
                <div className={styles.inputContainer}>
                    <div>
                        <h4>Nom du groupe</h4>
                        <p className={"groupSettingSubtitle"}>Définis le nom de ton groupe.</p>
                    </div>

                    <input
                        name="name"
                        type="text"
                        value={groupSettingsForm.name}
                        className={`${styles.input} ${isDisabled ? styles.inputDisabled : ""}`}
                        autoFocus={true}
                        autoComplete="off"
                        autoCorrect="off"
                        onChange={(e) => handleChangeGroupProp(e.target.name, e.target.value)}
                        disabled={isDisabled}
                    />
                </div>

                <div className={styles.inputContainer}>
                    <div>
                        <h4>Description</h4>
                        <p className={"groupSettingSubtitle"}>Décris ton groupe en quelques mots.</p>
                    </div>

                    <textarea
                        name="description"
                        value={groupSettingsForm.description ?? ""}
                        placeholder={"Présente ton groupe en quelques mots..."}
                        className={`${styles.input} ${styles.textArea} ${isDisabled ? styles.inputDisabled : ""}`}
                        onChange={(e) => handleChangeGroupProp(e.target.name, e.target.value)}
                        disabled={isDisabled}
                    />
                </div>
            </div>

            <div className={styles.avatarContainer}>
                <div>
                    <h4>Avatar</h4>
                    <p className={"groupSettingSubtitle"}>Personnalise l&apos;avatar de ton groupe.</p>
                </div>

                <div className={styles.avatarContent}>
                    <div className={styles.mainAvatarContainer}>
                        <div className={styles.mainAvatar}>
                            <DbImage
                                src={
                                    previewAvatarUrl ??
                                    getPublicAvatarUrl("groups", selectedAvatar ? selectedAvatar.name : defaultAvatarUrl)
                                }
                                alt={previewAvatarUrl ? "Preview avatar" : "User avatar"}
                                width={96}
                                height={96}
                            />
                        </div>

                        <DefaultButton disabled={isDisabled}>
                            <label htmlFor="avatarInput" className={`${isDisabled ? styles.buttonDisabled : ""}`}>
                                <p>Importer un avatar</p>
                            </label>
                            <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                onChange={handleSelectFile}
                                disabled={isDisabled}
                            />
                        </DefaultButton>
                    </div>

                    <div className={styles.avatarsPresets}>
                        <p>Avatars prédéfinis</p>
                        <div className={`${styles.avatarsContainer} ${isDisabled ? styles.avatarsDisabled : ""}`}>
                            {avatarsPresets?.map((avatar: Avatar) => (
                                <DbImage
                                    key={avatar.id}
                                    src={getPublicAvatarUrl(avatar.type, avatar.name)}
                                    alt={previewAvatarUrl ? "Preview avatar" : "User avatar"}
                                    width={56}
                                    height={56}
                                    onClick={() => !isDisabled && handleSelectAvatar(avatar)}
                                    className={`${avatar.id === groupSettingsForm.avatar?.id ? styles.selectedAvatar : ""}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}