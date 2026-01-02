import styles from "./avatarSettings.module.scss";
import React, {useState} from "react";
import {Avatar, Profile} from "@/utils/types";
import SubmitButtons from "@/components/app/userSettings/submitButtons/submitButtons";
import SettingsSectionWrapper from "@/components/app/userSettings/settingsSectionWrapper/settingsSectionWrapper";
import {fetcher, getPublicAvatarUrl} from "@/utils/globalFunctions";
import {DbImage} from "@/components/general/dbImage/dbImage";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import Image from "next/image";
import {useToasts} from "@/utils/useToasts";
import useSWR from "swr";
import {AnimatePresence, motion} from "framer-motion";

interface AvatarSettingsProps {
    profile: Profile;
    refreshProfile: () => void;
}

export default function AvatarSettings({profile, refreshProfile}: AvatarSettingsProps) {
    const [displaySaveModal, setDisplaySaveModal] = useState(false);
    const defaultAvatarUrl = profile?.avatar.name;
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

    const {successToast, errorToast} = useToasts();

    const { data: userAvatars, isLoading: isUserAvatarsLoading, mutate: refreshUserAvatarsList } = useSWR(
        '/api/user/avatars',
        (url) => fetcher(url, "Impossible de charger vos avatars récents")
    );
    const userAvatarsFiltered = userAvatars?.filter((avatar: Avatar) => avatar.id !== profile?.avatar.id);

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedAvatar(null);
        setPreviewAvatarUrl(URL.createObjectURL(file));
        setImageFile(file);
        setDisplaySaveModal(true);
    }

    const handleSelectAvatar = (avatar: Avatar) => {
        setPreviewAvatarUrl(null);
        setImageFile(null);

        setSelectedAvatar(avatar);
        setDisplaySaveModal(true);
    }

    const handleReset = () => {
        setPreviewAvatarUrl(null);
        setImageFile(null);
        setSelectedAvatar(null);
        setDisplaySaveModal(false);
    }

    const handleSubmit = async () => {
        if (!imageFile && !selectedAvatar) return;

        try {
            const formData = new FormData();

            if (imageFile) {
                formData.append('avatarFile', imageFile);
            } else if (selectedAvatar) {
                formData.append('avatarId', selectedAvatar.id);
            }

            const res = await fetch('/api/user', {
                method: 'PUT',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                errorToast("Une erreur est survenue. Si le problème persiste, contacte le support.");
                return;
            }

            if (data.success) {
                successToast("Ton avatar a bien été mis à jour.");
                refreshProfile();
                setDisplaySaveModal(false);
                refreshUserAvatarsList();
            }
        } catch (err) {
            errorToast('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    }

    const handleDelete = async (avatar: Avatar) => {
        setPreviewAvatarUrl(null);
        setImageFile(null);
        setSelectedAvatar(null);
        setDisplaySaveModal(false);

        try {
            const res = await fetch('/api/avatars/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    avatarId: avatar.id,
                    avatarName: avatar.name,
                }),
            })

            if (!res.ok) {
                const { error } = await res.json();
                errorToast(
                    error ?? "Une erreur a eu lieu lors de la suppression de ton avatar."
                );
                return;
            }

            successToast(`Ton avatar a bien été supprimé.`)
            await refreshUserAvatarsList();
        } catch (err) {
            errorToast('Une erreur est survenue');
        }
    }

    return !isUserAvatarsLoading && (
        <>
            <div className={styles.settingsContainer}>
                <SettingsSectionWrapper sectionTitle={"Changer d'avatar"}>
                    <div className={styles.globalAvatarContainer}>
                        <div className={styles.mainAvatarContainer}>
                            <DbImage
                                src={
                                    previewAvatarUrl ??
                                    getPublicAvatarUrl("users", selectedAvatar ? selectedAvatar.name : defaultAvatarUrl)
                                }
                                alt={previewAvatarUrl ? "Preview avatar" : "User avatar"}
                                width={96}
                                height={96}
                            />
                        </div>

                        <DefaultButton>
                            <label htmlFor="avatarInput">
                                <Image
                                    src={"/icons/picture.svg"}
                                    alt={"User avatar"}
                                    width={20}
                                    height={20}
                                />
                                <p>Importer un avatar</p>
                            </label>
                            <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                onChange={handleSelectFile}
                            />
                        </DefaultButton>
                    </div>
                </SettingsSectionWrapper>

                <div className={styles.allAvatarsContainers}>
                    <div className={styles.avatarsContainerSection}>
                        <h4>Avatars récents</h4>

                        <div className={styles.avatarsContainer}>
                            <AnimatePresence initial={false} mode="sync">
                                {(userAvatarsFiltered ?? []).map((avatar: Avatar) => (
                                    <motion.div
                                        key={avatar.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`${styles.recentAvatar} ${avatar.id === selectedAvatar?.id ? styles.selectedAvatar : ""}`}
                                    >
                                        <DbImage
                                            src={getPublicAvatarUrl(avatar.type, avatar.name)}
                                            alt={previewAvatarUrl ? "Preview avatar" : "User avatar"}
                                            width={96}
                                            height={96}
                                            onClick={() => handleSelectAvatar(avatar)}
                                        />
                                        <div className={styles.deleteContainer}>
                                            <Image
                                                src={"/icons/trash.svg"}
                                                alt={"User avatar"}
                                                width={20}
                                                height={20}
                                                onClick={() => handleDelete(avatar)}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <SubmitButtons
                displayButtons={displaySaveModal}
                handleReset={handleReset}
                handleSubmit={handleSubmit}
            />
        </>
    );
}