import styles from "./newGroupModal.module.scss";
import Image from "next/image";
import DefaultField from "@/components/general/defaultField/defaultField";
import {useEffect, useState} from "react";
import GlassButton from "@/components/general/glassButton/glassButton";
import {nanoid} from "nanoid";
import {useToasts} from "@/utils/useToasts";
import useSWR, {KeyedMutator} from "swr";
import {fetcher, getPublicAvatarUrl} from "@/utils/globalFunctions";
import {Avatar, Group} from "@/utils/types";
import {DbImage} from "@/components/general/dbImage/dbImage";
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";

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

    const { data: avatarsPresets, error: avatarPresetsError, isLoading: isAvatarsPresetsLoading } = useSWR(
        '/api/avatars/presets',
        (url) => fetcher(url, "Impossible de charger les presets d'avatars")
    );

    useEffect(() => {
        if (avatarPresetsError) {
            errorToast("Une erreur s'est produite, veuillez réessayer.")
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
                setErrorMessages(prev => ({ ...prev, invitationCode: data.error }));
                return;
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

    return !isAvatarsPresetsLoading && (
        <ModalWrapper setModal={setModal} closeIconTopPosition={"336px"}>
            <div className={styles.createGroupContainer}>
                <div className={styles.formHeader}>
                    <h1>Créer un nouveau groupe</h1>
                    <p>Fais de ton groupe un espace unique en choisissant son nom et son icône.</p>
                </div>

                <form className={styles.createGroupForm} onSubmit={handleCreateGroup}>
                    <div className={styles.avatarInput}>
                        <label htmlFor={"avatar"}>Avatar de groupe <span>*</span></label>
                        <div className={styles.avatarContainer}>
                            <button
                                type={"button"}
                                className={`${styles.avatarPreviewButton} ${previewUrl ? styles.avatarPreviewButtonFull : ""} ${errorMessages.avatar ? styles.requiredError : ""}`}>
                                <label htmlFor="avatarInput">
                                    {previewUrl ? (
                                        <DbImage
                                            src={previewUrl}
                                            alt="Preview avatar"
                                            width={96}
                                            height={96}
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
                                    id="avatarInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </button>

                            <div className={styles.avatarsButtonsContainer}>
                                <p>Si tu ne sais pas quoi mettre voici quelques idées, tu pourras toujours le modifier plus tard.</p>
                                <div className={styles.avatarsSelectors}>
                                    {avatarsPresets?.map((avatar: Avatar) => (
                                        <DbImage
                                            key={avatar.id}
                                            src={getPublicAvatarUrl(avatar.type, avatar.name)}
                                            alt="Avatar preset"
                                            width={48}
                                            height={48}
                                            className={`${styles.avatarPreset} ${selectedAvatar === avatar.id ? styles.selectedAvatar : ""}`}
                                            onClick={() => {
                                                setErrorMessages((prev) => ({
                                                    ...prev,
                                                    avatar: ""
                                                }));
                                                setSelectedAvatar(avatar.id);
                                                setPreviewUrl(getPublicAvatarUrl(avatar.type, avatar.name));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.fieldAndButtonContainer}>
                        <DefaultField
                            type={"text"}
                            label={"Nom du groupe"}
                            value={newGroupName}
                            handleChange={(e) => handleChange("name", e.target.value)}
                            isRequired={true}
                            errorMessage={errorMessages?.name}
                            maxLength={30}
                        />

                        <div className={styles.submitButton}>
                            <GlassButton
                                type={"submit"}
                                isDisabled={isLoading || isDisabled}
                            >
                                Créer mon groupe
                            </GlassButton>
                        </div>
                    </div>
                </form>
            </div>

            <div className={styles.joinGroupContainer}>
                <h3>Tu as un code d&apos;invitation?</h3>
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
                    />

                    <button
                        type={"submit"}
                        disabled={!!errorMessages.invitationCode || isLoading}
                        className={`${!!errorMessages.invitationCode || isLoading? "glassButtonDisabled" : ""}`}
                    >
                        Rejoindre
                    </button>
                </form>
                <p className={"errorMessage"}>{errorMessages.invitationCode}</p>
            </div>
        </ModalWrapper>
    )
}