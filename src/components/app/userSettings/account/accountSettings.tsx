import React, {useMemo, useState} from "react";
import styles from "./accountSettings.module.scss";
import SettingsSectionWrapper from "@/components/app/userSettings/settingsSectionWrapper/settingsSectionWrapper";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import {Profile, UserProps} from "@/utils/types";
import EditUserModal from "@/components/app/userSettings/account/editModal/editUserModal";
import SubmitButtons from "@/components/app/userSettings/submitButtons/submitButtons";
import {AnimatePresence} from "framer-motion";
import {useToasts} from "@/utils/helpers/useToasts";
import Image from "next/image";
import DeleteModal from "@/components/general/deleteModal/deleteModal";

interface AccountSettingsProps {
    profile: Profile;
    refreshProfile: () => void;
}

export default function AccountSettings({profile, refreshProfile}: AccountSettingsProps) {
    const emailChangePending = useMemo(() => (!!profile?.new_email), [profile]);
    const defaultAccountSettings = useMemo(() => ({
        email: profile?.email ?? '',
        password: '',
        username: profile?.username ?? '',
    }), [profile]);
    const [newAccountSettings, setNewAccountSettings] = useState({...defaultAccountSettings});
    const [propToEdit, setPropToEdit] = useState<UserProps | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [displaySaveModal, setDisplaySaveModal] = useState(false);
    const {errorToast, successToast} = useToasts();


    const handleClick = (prop: UserProps) => {
        setIsEditModalOpen(true);
        setPropToEdit(prop);
    }

    const handleChangeUserProps = (key: UserProps | null, newValue: string | null | undefined) => {
        if (!key) return;
        const updatedProps = {
            ...newAccountSettings,
            [key]: newValue
        };
        setNewAccountSettings(updatedProps);

        const hasChanges = JSON.stringify(updatedProps) !== JSON.stringify(defaultAccountSettings);
        setDisplaySaveModal(hasChanges);
    }

    const handleReset = () => {
        setNewAccountSettings({...defaultAccountSettings});
        setPropToEdit(null);
        setDisplaySaveModal(false);
    }

    const handleSubmit = async (newPassword?: string) => {
        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: defaultAccountSettings.email !== newAccountSettings.email && newAccountSettings.email,
                    password: newPassword ?? null,
                    username: defaultAccountSettings.username !== newAccountSettings.username && newAccountSettings.username,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'update_auth_failed':
                        errorToast('Une erreur est survenue lors de la mise à jour de ton email ou de ton mot de passe.');
                        break;
                    case 'update_profile_failed':
                        errorToast("Une erreur est survenue lors de la mise à jour de ton nom d'utilisateur.");
                        break;
                    default:
                        errorToast("Une erreur est survenue. Si le problème persiste, contacte le support.");
                }
                return;
            }

            if (data.success) {
                if (data.emailConfirmationSent) {
                    successToast("Un email de confirmation a été envoyé à ta nouvelle adresse email.");
                } else if (data.passwordHasChanged) {
                    successToast("Ton mot de passe a été mis à jour avec succès.");
                } else {
                    successToast("Tes informations ont bien été mises à jour.");
                }
                refreshProfile();
            }
        } catch (err) {
            errorToast('Une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            setDisplaySaveModal(false);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!res.ok) {
                errorToast("Une erreur est survenue lors de la suppression de ton compte. Si le problème persiste, contacte le support")
            }

            successToast(`Ton compte à bien été supprimé.`);
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
            errorToast('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    }

    return (
        <>
            <div className={styles.settingsContainer}>
                <SettingsSectionWrapper sectionTitle={"Informations générales"}>
                    <div className={styles.wrapperContentContainer}>
                        <div className={styles.wrapperContent}>
                            <div className={styles.accountPropsContainer}>
                                <div className={styles.accountPropsTexts}>
                                    <h4>Nom d&apos;utilisateur</h4>
                                    <p className={styles.defaultValue}>{newAccountSettings.username}</p>
                                </div>
                                <DefaultButton handleClick={() => handleClick('username')}>Modifier</DefaultButton>
                            </div>
                            <div className={styles.accountPropsContainer}>
                                <div className={styles.accountPropsTexts}>
                                    <h4>Adresse e-mail</h4>
                                    {emailChangePending ? (
                                        <div className={styles.emailContainer}>
                                            <p className={styles.defaultValue}>{defaultAccountSettings.email}</p>
                                            <div className={styles.newEmailTag}>
                                                <p>CHANGEMENT EN ATTENTE</p>
                                                <div className={styles.newEmailValue}>
                                                    <p>
                                                        <Image src="/icons/info.svg" alt="Logotype" className={styles.logo} width={14} height={14}/>
                                                        Un email de changement à été envoyé à l&apos;adresse email : {profile?.new_email}.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={styles.defaultValue}>{newAccountSettings.email}</p>
                                    )}
                                </div>
                                <DefaultButton handleClick={() => handleClick('email')}>
                                    Modifier
                                </DefaultButton>
                            </div>
                            <div className={styles.accountPropsContainer}>
                                <div className={styles.accountPropsTexts}>
                                    <h4>Mot de passe</h4>
                                </div>
                                <DefaultButton handleClick={() => handleClick('password')}>Changer de mot de passe</DefaultButton>
                            </div>
                        </div>
                    </div>
                </SettingsSectionWrapper>

                <SettingsSectionWrapper sectionTitle={"Suppression du compte"}>
                    <div className={styles.wrapperContentContainer}>
                        <div className={`${styles.wrapperContent} ${styles.deleteSection}`}>
                            <p>
                                En cliquant sur ce bouton, tu supprimera ton compte et tes données associées.
                                Seuls les groupes dont tu es l&apos;unique membre seront fermés.
                                Pour les autres groupes, tes likes seront tous supprimés mais les jeux que tu y as
                                partagés ne le seront pas afin de ne pas impacter les autres membres.
                            </p>

                            <button type={"submit"} className={styles.deleteButton} onClick={() => setIsDeleteModalOpen(true)}>
                                Supprimer mon compte
                            </button>
                        </div>
                    </div>
                </SettingsSectionWrapper>
            </div>

            <SubmitButtons
                displayButtons={displaySaveModal}
                handleReset={handleReset}
                handleSubmit={handleSubmit}
            />

            <AnimatePresence mode={"wait"}>
                {isEditModalOpen && (
                    <EditUserModal
                        settingProp={propToEdit}
                        setModal={setIsEditModalOpen}
                        propValue={propToEdit && newAccountSettings[propToEdit]}
                        onSubmit={handleChangeUserProps}
                        onSubmitPassword={handleSubmit}
                        email={defaultAccountSettings.email}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode={"wait"}>
                {isDeleteModalOpen && (
                    <DeleteModal
                        setModal={setIsDeleteModalOpen}
                        closeIconTopPosition={"250px"}
                        handleDelete={handleDelete}
                        withInput={true}
                        deleteLabel={'Si tu es certain de ta décision, saisis “SUPPRIMER” pour continuer.'}
                        leaveButtonText={"Supprimer mon compte"}
                    >
                        <h1>Supprimer ton compte</h1>
                        <p>
                            <span className="boldText">Attention : </span> la suppression de ton compte <span className="boldText">supprimera toutes tes données</span>.
                            Les groupes dont tu es l’unique membre seront <span className="boldText">fermés et tes likes supprimés</span>, mais les jeux partagés dans d’autres groupes <span className="boldText">resteront disponibles pour les autres membres.</span>
                        </p>

                        <h4>Es-tu sûr de vouloir supprimer ton compte?</h4>
                    </DeleteModal>
                )}
            </AnimatePresence>
        </>
    );
}