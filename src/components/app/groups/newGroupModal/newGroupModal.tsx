import styles from "./newGroupModal.module.scss";
import Image from "next/image";
import DefaultField from "@/components/general/defaultField/defaultField";
import React, {useEffect, useMemo, useState} from "react";
import GlassButton from "@/components/general/glassButton/glassButton";
import {nanoid} from "nanoid";
import {useToasts} from "@/utils/helpers/useToasts";
import {KeyedMutator} from "swr";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import {Avatar, Group} from "@/utils/types";
import {DbImage} from "@/components/general/dbImage/dbImage";
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";
import {useSWRWithError} from "@/utils/helpers/useSWRWithError";
import {Skeleton} from "@mui/material";
import {useMediaQueries} from "@/utils/helpers/useMediaQueries";
import MobileGenericButton from "@/components/app/responsive/mobileGenericButton/mobileGenericButton";

interface NewGroupModalProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    refreshGroups: KeyedMutator<Group[]>;
}

export default function NewGroupModal({setModal, refreshGroups}: NewGroupModalProps) {
    const {successToast, errorToast} = useToasts();

    const [newGroupName, setNewGroupName] = useState<string>("");
    const inviteCode = nanoid(10);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMessages, setErrorMessages] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: avatarsPresets,
        isLoading: areAvatarsPresetsLoading,
        error: avatarPresetsError,
    } = useSWRWithError<Avatar[]>('/api/avatars/presets', {
        errorMessage: "Une erreur s'est produite en essayant de charger les presets d'avatars.",
    });

    useEffect(() => {
        if (avatarPresetsError) {
            setModal(false)
        }
    }, [avatarPresetsError]);


    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        if (!selectedAvatar && !imageFile) {
            errors.avatar = "Avatar de groupe requis."
            setIsDisabled(true);
        }

        if (!newGroupName) {
            errors.name = "Nom du groupe requis."
        } else if (newGroupName.length < 3) {
            errors.name = "Le nom du groupe requiert au moins 3 caractères."
        }

        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isDisabled) return;
        if (!validateForm()) return;

        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', newGroupName);
        formData.append('inviteCode', inviteCode);

        if (selectedAvatar) {
            formData.append('avatarId', selectedAvatar);
        }

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                body: formData,
            });

            // const data = await res.json();
            if (!res.ok) {
                errorToast("Impossible de créer un groupe.");
            }

            setModal(false);
            await refreshGroups();
            successToast('Ton groupe a été créé avec succès !');
        } catch (err) {
            errorToast("Une erreur est survenue.");
            setIsDisabled(false);
        } finally {
            setIsDisabled(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAvatar(null);
        setErrorMessages((prev) => ({
            ...prev,
            avatar: ""
        }));
        setIsDisabled(false);

        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleChange = (field: string, value: string) => {
        setNewGroupName(value);

        if (value === "") {
            setErrorMessages((prev) => ({ ...prev, [field]: "Nom du groupe requis." }));
            setIsDisabled(true);
        } else if (value.length > 30) {
            setErrorMessages((prev) => ({ ...prev, [field]: "Le nom du groupe doit faire au maximum 30 caractères."}));
            setIsDisabled(true);
        } else {
            setErrorMessages((prev) => ({ ...prev, [field]: "" }))
            setIsDisabled(false);
        }
    }

    const handleJoinGroup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const code = formData.get('invitationCode')?.toString().trim();

        if (!code) {
            setErrorMessages(prev => ({
                ...prev,
                invitationCode: "Un code d'invitation est requis.",
            }));
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/groups/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            })

            const data = await res.json();

            if (!res.ok) {
                switch (data.error){
                    case "already_member":
                        setErrorMessages(prev => ({ ...prev, invitationCode: "Tu fais déjà partie de ce groupe." }));
                        return;
                    case "invalid_code":
                        setErrorMessages(prev => ({ ...prev, invitationCode: "Code invalide ou groupe introuvable." }));
                        return;
                    case "group_close":
                        setErrorMessages(prev => ({ ...prev, invitationCode: "Ce groupe est fermé, tu ne peux pas le rejoindre." }));
                        return;
                    default:
                        setErrorMessages(prev => ({ ...prev, invitationCode: data.error }));
                        return;
                }
            }

            await refreshGroups();
            setModal(false);
            successToast('Tu as bien rejoint le groupe !');
        } catch (err) {
            errorToast("Une erreur s'est produite.");
        } finally {
            setIsLoading(false);
        }
    };

    // Responsive section
    const {maxIsTablet} = useMediaQueries();
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const isFormComplete = useMemo(() => {
        if (!newGroupName) return false;
        if (!selectedAvatar && !imageFile) return false;
        return validateForm();
    }, [newGroupName, selectedAvatar, imageFile]);

    return (
        <ModalWrapper setModal={setModal} closeIconTopPosition={"336px"} maxIsTablet={maxIsTablet}>
            {maxIsTablet ? (
                <div className={styles.mobileFormHeader}>
                    <MobileGenericButton buttonDetails={{variant: "icon", content: "close", callback: () => setModal(prev => !prev)}}/>
                    <h1>Nouveau groupe</h1>
                    <MobileGenericButton
                        buttonDetails={{variant: "validation", content: isFormComplete ? "checkGreen" : "check", disabled: !isFormComplete, callback: () => handleCreateGroup}}
                        formId={"newGroupForm"}
                    />
                </div>
            ) : (
                <div className={styles.formHeader}>
                    <h1>Créer un nouveau groupe</h1>
                    <p>Fais de ton groupe un espace unique en choisissant son nom et son icône.</p>
                </div>
            )}

            <form id="newGroupForm" className={styles.createGroupForm} onSubmit={handleCreateGroup}>
                <div className={styles.avatarContainer}>
                    <div className={styles.avatarPreviewContainer}>
                        {!maxIsTablet && <label htmlFor={"avatar"}>Avatar de groupe <span>*</span></label>}
                        <button
                            type={"button"}
                            className={`${styles.avatarPreviewButton} ${previewUrl ? styles.avatarPreviewButtonFull : ""} ${errorMessages.avatar ? styles.requiredError : ""}`}>
                            <label htmlFor="newAvatarInput">
                                {previewUrl ? (
                                    <DbImage
                                        src={previewUrl}
                                        alt="Preview avatar"
                                        width={96}
                                        height={96}
                                        className={styles.previewImage}
                                    />
                                ) : (
                                    <Image
                                        src="/icons/picture.svg"
                                        alt="Avatar icon"
                                        width={32}
                                        height={32}
                                    />
                                )}
                            </label>
                            <input
                                id="newAvatarInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </button>
                    </div>

                    <div className={styles.avatarsButtonsContainer}>
                        {!maxIsTablet && <p>Si tu ne sais pas quoi mettre voici quelques idées, tu pourras toujours le modifier plus tard.</p>}
                        <div className={styles.avatarsSelectors}>
                            {areAvatarsPresetsLoading ? (
                                Array.from({length: 6}).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        variant="rectangular"
                                        animation={false}
                                        width={"48px"}
                                        height={"48px"}
                                        style={{borderRadius: "4px"}}
                                    />
                                ))
                            ) : (
                                avatarsPresets?.map((avatar: Avatar) => (
                                    <DbImage
                                        key={avatar.id}
                                        src={getPublicAvatarUrl(avatar.type, avatar.name)}
                                        alt="Avatar preset"
                                        width={48}
                                        height={48}
                                        className={`${styles.avatarPreset} ${selectedAvatar === avatar.id ? styles.selectedAvatar : ""}`}
                                        onClick={() => {
                                            setImageFile(null);
                                            setErrorMessages((prev) => ({
                                                ...prev,
                                                avatar: ""
                                            }));
                                            setSelectedAvatar(avatar.id);
                                            setPreviewUrl(getPublicAvatarUrl(avatar.type, avatar.name));
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.fieldAndButtonContainer}>
                    <DefaultField
                        type={"text"}
                        label={maxIsTablet ? "" :  "Nom du groupe"}
                        placeholder={maxIsTablet ? "Nom du groupe" : ""}
                        value={newGroupName}
                        handleChange={(e) => handleChange("name", e.target.value)}
                        isRequired={true}
                        errorMessage={errorMessages?.name}
                        maxLength={30}
                        version={maxIsTablet ? "mobile" : "default"}
                    />

                    {!maxIsTablet && (
                        <div className={styles.submitButton}>
                            <GlassButton
                                type={"submit"}
                                isDisabled={isLoading || isDisabled}
                            >
                                Créer mon groupe
                            </GlassButton>
                        </div>
                    )}
                </div>
            </form>

            <div className={`${styles.joinGroupContainer} ${isJoinModalOpen ? styles.mobileJoinGroupContainer : ""}`}>
                <div className={styles.joinGroupTitleContainer} onClick={() => maxIsTablet && setIsJoinModalOpen(prevState => !prevState)}>
                    <h3>Tu as un code d&apos;invitation?</h3>
                    {maxIsTablet && <Image src="/icons/arrowRight.svg" alt="Right arrow icon" width={24} height={24}/>}
                </div>
                <form className={styles.joinGroupForm} onSubmit={handleJoinGroup}>
                    <input
                        name="invitationCode"
                        type="text"
                        placeholder="Code d'invitation"
                        autoComplete="off"
                        autoCorrect="off"
                        onChange={() => {
                            setErrorMessages({invitationCode: ""});
                        }}
                        className={!!errorMessages.invitationCode || isLoading ? styles.errorInput : ""}
                    />

                    <button
                        type={"submit"}
                        disabled={!!errorMessages.invitationCode || isLoading}
                        className={`${!!errorMessages.invitationCode || isLoading? "glassButtonDisabled" : ""}`}
                    >
                        Rejoindre
                    </button>
                </form>
                {!maxIsTablet && <p className={"errorMessage"}>{errorMessages.invitationCode}</p>}
            </div>
        </ModalWrapper>
    )
}