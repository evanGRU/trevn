import styles from "./newGroupModal.module.scss";
import Image from "next/image";
import DefaultField from "@/components/general/defaultField/defaultField";
import {useEffect, useState} from "react";
import GlassButton from "@/components/general/glassButton/glassButton";
import {nanoid} from "nanoid";
import {createClient} from "@/utils/supabase/client";
import {useAuthToast} from "@/utils/useAuthToast";
import {KeyedMutator} from "swr";
import {AnimatePresence, motion} from "framer-motion";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import {Avatar, Group, Profile} from "@/utils/types";
import {DbImage} from "@/utils/dbImage/dbImage";

interface NewGroupModalProps {
    user: Profile;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    refreshGroups: KeyedMutator<Group[]>;
}

export default function NewGroupModal({user, setModal, refreshGroups}: NewGroupModalProps) {
    const supabase = createClient();
    const {successToast, errorToast} = useAuthToast();

    const [newGroupName, setNewGroupName] = useState<string>("");
    const inviteCode = nanoid(10);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    const [defaultAvatars, setDefaultAvatars] = useState<Avatar[]>([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMessages, setErrorMessages] = useState<{[key: string]: string}>({})

    useEffect(() => {
        const fetchDefaultAvatars = async () => {
            const { data, error } = await supabase
                .from("avatars")
                .select("id, type, name")
                .eq("type", "group")
                .eq("is_custom", false);

            if (error) {
                errorToast('Une erreur s\'est produite, veuillez réessayer.');
                setModal(false);
                throw error;
            }

            setDefaultAvatars(data);
        }

        fetchDefaultAvatars();
    }, []);

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        if (!selectedAvatar && !imageFile) {
            errors.avatar = "Avatar de groupe requis."
            setIsDisabled(true);
        }

        if (!newGroupName) {
            errors.name = "Nom du groupe requis."
        }

        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        if (!validateForm()) return;

        try {
            setIsDisabled(true);
            let avatarId: string | null = selectedAvatar ?? null;

            if (imageFile) {
                const fileExt = imageFile.name.split(".").pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;

                const {error: uploadError} = await supabase.storage
                    .from("avatars/groups")
                    .upload(fileName, imageFile, {upsert: true});

                if (uploadError) {
                    setIsDisabled(false);
                    errorToast("Impossible d'importer l'avatar de groupe, veuillez réessayer.");
                    return;
                }

                const {data: avatarData, error: avatarError} = await supabase
                    .from("avatars")
                    .insert({
                        type: "group",
                        name: fileName,
                        is_custom: true,
                        created_by: user.id
                    })
                    .select("*")
                    .single();

                if (avatarError || !avatarData) {
                    setIsDisabled(false);
                    errorToast("Impossible d’enregistrer l’avatar, veuillez réessayer.");
                    return;
                }

                avatarId = avatarData.id;
            }

            const { data: groupData, error: groupError } = await supabase
                .from("groups")
                .insert({
                    name: newGroupName,
                    created_by: user.id,
                    invite_code: inviteCode,
                    avatar_id: avatarId
                })
                .select(`
                    *,
                    groups_members (
                        user_id
                    )
                `)
                .single();

            if (groupError || !groupData) {
                setIsDisabled(false);
                errorToast("Impossible de créer le groupe, veuillez réessayer.");
                return;
            }

            const { error: linkError } = await supabase
                .from("groups_members")
                .insert({
                    group_id: groupData.id,
                    user_id: user.id
                });

            if (linkError) {
                setIsDisabled(false);
                errorToast("Une erreur est survenue lors de l’ajout du membre.");
                return;
            }

            setModal(false);
            await refreshGroups();
            successToast("Ton groupe a été créé avec succès !");

        } catch (err) {
            setIsDisabled(false);
            console.error(err);
            errorToast("Une erreur inattendue s'est produite.");
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
        } else if (value.length > 20) {
            setErrorMessages((prev) => ({ ...prev, [field]: "Le nom du groupe doit faire au maximum 20 caractères."}));
            setIsDisabled(true);
        } else {
            setErrorMessages((prev) => ({ ...prev, [field]: "" }))
            setIsDisabled(false);
        }
    }

    const handleJoinGroup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get("invitationCode") as string;

        if (!code) {
            setErrorMessages(prev => ({
                ...prev,
                invitationCode: "Un code d'invitation est requis."
            }));
            return
        }

        const res = await fetch("/api/groups/join", {
            method: "POST",
            body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMessages(prev => ({
                ...prev,
                invitationCode: data.error
            }));
        } else {
            setModal(false);
            await refreshGroups();
            successToast("Tu as bien rejoint le groupe !");
        }
    };

    return defaultAvatars.length > 1 && (
        <div className={styles.fullBackground}>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={styles.newGroupModalContainer}>
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
                                                        src="/icons/avatar.svg"
                                                        alt="Icône avatar"
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
                                                {defaultAvatars.map((avatar) => (
                                                    <DbImage
                                                        key={avatar.id}
                                                        src={getPublicAvatarUrl("group", avatar.name)}
                                                        alt="Avatar par défaut"
                                                        width={48}
                                                        height={48}
                                                        className={styles.suggestedAvatar}
                                                        onClick={() => {
                                                            setErrorMessages((prev) => ({
                                                                    ...prev,
                                                                    avatar: ""
                                                            }));
                                                            setSelectedAvatar(avatar.id);
                                                            setPreviewUrl(getPublicAvatarUrl("group", avatar.name));
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DefaultField
                                    type={"text"}
                                    label={"Nom du groupe"}
                                    value={newGroupName}
                                    handleChange={(e) => handleChange("name", e.target.value)}
                                    isRequired={true}
                                    errorMessage={errorMessages?.name}
                                />

                                <div className={styles.submitButton}>
                                    <GlassButton
                                        type={"submit"}
                                        isDisabled={isDisabled}
                                    >Créer mon groupe</GlassButton>
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
                                        setErrorMessages(prev => ({
                                            ...prev,
                                            invitationCode: ""
                                        }));
                                    }}
                                />
                                <button type={"submit"} disabled={!!errorMessages.invitationCode} className={`${!!errorMessages.invitationCode ? "glassButtonDisabled" : ""}`}>Rejoindre</button>
                            </form>
                            {errorMessages.invitationCode && <p className={"errorMessage"}>{errorMessages.invitationCode}</p>}
                        </div>
                    </div>

                    <button
                        type={"button"}
                        className={styles.closeModalIcon}
                        onClick={() => setModal(false)}
                    >
                        <Image
                            src="/icons/close.svg"
                            alt="Icône de fermeture"
                            width={24}
                            height={24}
                        />
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}