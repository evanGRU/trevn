'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "@supabase/auth-js";
import styles from "./page.module.scss";
import EditSettingsModal from "@/components/settingsModales/editSettingsModal";
import { createClient } from "@/utils/supabase/client";
import { getPublicAvatarUrl } from "@/utils/globalFunctions";

type Profile = {
    username: string;
    avatar_url: string | null;
};

type SettingsClientProps = {
    initialProfile: Profile | null;
    initialUser: User | null;
};

type DefaultChanges = {
    user_id: string | undefined;
    username: string | undefined;
    email: string | undefined;
    password: string;
    avatar: string | null | undefined;
};

const defaultChanges: DefaultChanges = {
    user_id: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
};

type ModalCode = "username" | "email" | "password" | "avatar";

export default function SettingsClient({ initialProfile, initialUser }: SettingsClientProps) {
    const supabase = createClient();

    const [user, setUser] = useState<User | null>(initialUser);
    const [profile, setProfile] = useState<Profile | null>(initialProfile);

    const [fullUser, setFullUser] = useState<DefaultChanges>(defaultChanges);
    const [defaultFullUser, setDefaultFullUser] = useState<DefaultChanges>(defaultChanges);
    const [haveUserBeenUpdated, setHaveUserBeenUpdated] = useState(false);

    const [modalCode, setModalCode] = useState<ModalCode | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const initFullUser = () => {
        const updatedUser: DefaultChanges = {
            user_id: user?.id ?? "",
            username: profile?.username ?? "",
            email: user?.email ?? "",
            password: "",
            avatar: profile?.avatar_url ?? null,
        };
        setFullUser(updatedUser);
        setDefaultFullUser(updatedUser);
    };

    useEffect(() => {
        initFullUser();
    }, [user, profile]);

    useEffect(() => {
        setHaveUserBeenUpdated(JSON.stringify(defaultFullUser) !== JSON.stringify(fullUser));
    }, [fullUser, defaultFullUser]);

    const refreshUser = async () => {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (!sessionError) {
            const refreshedUser = sessionData.session?.user ?? null;
            setUser(refreshedUser);

            if (refreshedUser?.id) {
                const { data: refreshedProfile } = await supabase
                    .from("profiles")
                    .select("username, avatar_url")
                    .eq("id", refreshedUser.id)
                    .single();
                setProfile(refreshedProfile ?? null);
            }
        }
    };

    const handleSaveChanges = async () => {
        if (!haveUserBeenUpdated) return;

        const run = async (promise: any) => {
            const { error } = await promise;
            if (error) throw error;
        };

        try {
            if (fullUser.username !== profile?.username) {
                await run(supabase.from("profiles").update({ username: fullUser.username }).eq("id", user?.id));
            }

            if (fullUser.email !== user?.email) {
                await run(supabase.auth.updateUser({ email: fullUser.email }));
            }

            if (fullUser.password) {
                await run(supabase.auth.updateUser({ password: fullUser.password }));
            }

            if (fullUser.avatar !== profile?.avatar_url) {
                await run(supabase.from("profiles").update({ avatar_url: fullUser.avatar }).eq("id", user?.id));
            }

            await refreshUser();
        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
        }
    };

    const handleUpdateUser = (e: React.FormEvent, newValue: string) => {
        e.preventDefault();
        if (!modalCode) return;

        setFullUser((prev) => ({
            ...prev,
            [modalCode]: newValue,
        }));

        setModalCode(null);
        setIsEditModalOpen(false);
    };

    const handleOpenModal = (code: ModalCode) => {
        setModalCode(code);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = (e: React.FormEvent) => {
        e.preventDefault();
        setModalCode(null);
        setIsEditModalOpen(false);
    };

    return (
        <div className={styles.settingsPage}>
            <div className={styles.settingsContainer}>
                <h1>Page paramètres</h1>

                <div className={styles.settingsModale}>
                    <h3>Informations personnelles</h3>
                    <ul>
                        <li className={styles.gray1}>
                            <p>Nom d&apos;utilisateur : {fullUser.username}</p>
                            <button onClick={() => handleOpenModal("username")}>Modifier</button>
                        </li>

                        <li className={styles.gray2}>
                            <p>Adresse email : {fullUser.email}</p>
                            <button
                                onClick={() => handleOpenModal("email")}
                                disabled={!!user?.new_email}
                                className={!!user?.new_email ? styles.editDisabled : ""}
                            >
                                {!!user?.new_email ? "En attente" : "Modifier"}
                            </button>
                        </li>

                        <li className={styles.gray1}>
                            <p>Mot de passe : </p>
                            <button onClick={() => handleOpenModal("password")}>Modifier le mot de passe</button>
                        </li>

                        <li className={styles.gray2}>
                              <span>
                                  <p>Avatar :</p>
                                  <Image
                                      src={getPublicAvatarUrl(fullUser.avatar)}
                                      alt="Photo de profil"
                                      width={36}
                                      height={36}
                                  />
                              </span>
                            <button onClick={() => handleOpenModal("avatar")}>Importer une image</button>
                        </li>
                    </ul>

                    {haveUserBeenUpdated && (
                        <div>
                            <button className={styles.saveButton} onClick={handleSaveChanges}>
                                Sauvegarder les changements
                            </button>
                            <button className={styles.resetButton} onClick={initFullUser}>
                                Réinitialiser les changements
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isEditModalOpen && modalCode && (
                <EditSettingsModal
                    modalCode={modalCode}
                    fullUser={fullUser}
                    handleUpdateUser={handleUpdateUser}
                    handleCloseModal={handleCloseModal}
                />
            )}
        </div>
    );
}
