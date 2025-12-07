import styles from "./editSettingsModal.module.scss";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { getPublicAvatarUrl } from "@/utils/globalFunctions";

const defaultModalTexts = {
    username: { title: "Modifier le nom d'utilisateur", label: "Nouveau nom d'utilisateur" },
    email: { title: "Modifier l'adresse email", label: "Nouvelle adresse email" },
    password: { title: "Modifier le mot de passe" },
    avatar: { title: "Modifier l'avatar" },
} as const;

type DefaultChanges = {
    user_id: string | undefined;
    username: string | undefined;
    email: string | undefined;
    password: string;
    avatar: string | null | undefined;
};

type ModalCode = keyof typeof defaultModalTexts;

type EditSettingsModalProps = {
    modalCode: ModalCode;
    fullUser: DefaultChanges;
    handleUpdateUser: (e: React.FormEvent, newValue: string) => void;
    handleCloseModal: (e: React.FormEvent) => void;
};

export default function EditSettingsModal({
                                              modalCode,
                                              fullUser,
                                              handleUpdateUser,
                                              handleCloseModal,
                                          }: EditSettingsModalProps) {
    const supabase = createClient();

    const [newValue, setNewValue] = useState(fullUser[modalCode] ?? "");
    const [passwordValues, setPasswordValues] = useState({
        current: (fullUser.password ?? ""),
        new: "",
        confirm: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordValues.new !== passwordValues.confirm) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!fullUser.email || !passwordValues.current) {
            setErrorMessage("Données manquantes");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: fullUser.email,
            password: passwordValues.current,
        });

        if (error) {
            setErrorMessage("Mot de passe actuel incorrect !");
            return;
        }

        handleUpdateUser(e, passwordValues.new);
    };

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUploadAvatar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedImage) return;

        const fileExt = selectedImage.name.split(".").pop();
        const fileName = `${fullUser.user_id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, selectedImage, { upsert: true });

        if (uploadError) {
            console.error(uploadError);
            return;
        }

        handleUpdateUser(e, fileName);
    };

    useEffect(() => {
        setErrorMessage("");
    }, [passwordValues]);

    useEffect(() => {
        if (modalCode === "password") {
            setPasswordValues({ current: fullUser.password, new: "", confirm: "" });
        } else {
            setNewValue(fullUser[modalCode] ?? "");
        }
    }, [fullUser, modalCode]);

    return (
        <div className={styles.editModalBackground}>
            <div className={styles.editModalContainer}>
                <h3>{defaultModalTexts[modalCode].title}</h3>

                <form
                    onSubmit={(e) => {
                        if (modalCode === "password") handleUpdatePassword(e);
                        else if (modalCode === "avatar") handleUploadAvatar(e);
                        else handleUpdateUser(e, newValue);
                    }}
                >
                    {modalCode === "password" ? (
                        <>
                            <div>
                                <label htmlFor="currentPassword">Mot de passe actuel</label>
                                <input
                                    name="currentPassword"
                                    type="password"
                                    value={passwordValues.current}
                                    onChange={(e) => setPasswordValues({ ...passwordValues, current: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword">Nouveau mot de passe</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    value={passwordValues.new}
                                    onChange={(e) => setPasswordValues({ ...passwordValues, new: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordValues.confirm}
                                    onChange={(e) => setPasswordValues({ ...passwordValues, confirm: e.target.value })}
                                />
                            </div>
                        </>
                    ) : modalCode === "avatar" ? (
                        <div>
                            <input type="file" accept="image/*" onChange={handleFileSelect} />
                            {previewUrl && (
                                <Image src={previewUrl} alt="Avatar" width={50} height={50} />
                            )}
                        </div>
                    ) : (
                        <div>
                            <label htmlFor={modalCode}>{defaultModalTexts[modalCode].label}</label>
                            <input
                                name={modalCode}
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                            />
                        </div>
                    )}

                    <div className={styles.editModalButtons}>
                        <button type="submit">Confirmer</button>
                        <button type="button" onClick={handleCloseModal}>
                            Annuler
                        </button>
                    </div>

                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}
