import React, {useState} from "react";
import styles from "./accountSettings.module.scss";
import SettingsSectionWrapper from "@/components/app/userSettings/settingsSectionWrapper/settingsSectionWrapper";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import {Profile} from "@/utils/types";

interface AccountSettingsProps {
    profile: Profile;
}

export default function AccountSettings({profile}: AccountSettingsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <SettingsSectionWrapper sectionTitle={"Informations générales"}>
                <div className={styles.wrapperContentContainer}>
                    <div className={styles.wrapperContent}>
                        <div className={styles.accountPropsContainer}>
                            <div className={styles.accountPropsTexts}>
                                <h4>Nom d&apos;utilisateur</h4>
                                <p>{profile?.username}</p>
                            </div>
                            <DefaultButton handleClick={() => setIsEditModalOpen(true)}>Modifier</DefaultButton>
                        </div>
                        <div className={styles.accountPropsContainer}>
                            <div className={styles.accountPropsTexts}>
                                <h4>Adresse e-mail</h4>
                                <p>{profile?.email}</p>
                            </div>
                            <DefaultButton handleClick={() => setIsEditModalOpen(true)}>Modifier</DefaultButton>
                        </div>
                        <div className={styles.accountPropsContainer}>
                            <div className={styles.accountPropsTexts}>
                                <h4>Mot de passe</h4>
                            </div>
                            <DefaultButton handleClick={() => setIsEditModalOpen(true)}>Changer de mot de passe</DefaultButton>
                        </div>
                    </div>
                </div>
            </SettingsSectionWrapper>

            <SettingsSectionWrapper sectionTitle={"Suppression du compte"}>
                <div className={styles.wrapperContentContainer}>
                    <div className={`${styles.wrapperContent} ${styles.deleteSection}`}>
                        <p>
                            En cliquant sur ce bouton, vous supprimerez votre compte et vos données associées.
                            Notez que seuls les groupes dont vous êtes l&apos;unique membre seront fermés.
                            Pour les autres groupes, les jeux que vous y avez partagés ne seront pas supprimés afin
                            de ne pas impacter les autres membres.
                        </p>

                        <button type={"submit"} className={styles.deleteButton}>
                            Supprimer mon compte
                        </button>
                    </div>
                </div>
            </SettingsSectionWrapper>
        </>


    );
}