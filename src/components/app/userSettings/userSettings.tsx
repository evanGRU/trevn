import styles from "./userSettings.module.scss";
import React, {useState} from "react";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import Image from "next/image";
import AccountSettings from "@/components/app/userSettings/account/accountSettings";
import {AnimatePresence, motion} from "framer-motion";
import {Profile} from "@/utils/types";
import {signout} from "@/utils/auth";

interface UserSettingsProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    profile: Profile;
}

const settingsNames = [
    {
        name: "Compte",
        iconPath: "/icons/account.svg",
        id: "account"
    },
    {
        name: "Avatar",
        iconPath: "/icons/avatar.svg",
        id: "avatar"
    }
];

export default function UserSettings({setModal, profile}: UserSettingsProps) {
    const [activeTab, setActiveTab] = useState(settingsNames[0]);
    const renderContent = () => {
        switch (activeTab.id) {
            case 'account':
                return <AccountSettings profile={profile} />;
            case 'avatar':
                return <div>Composant Avatar à venir...</div>;
            default:
                return null;
        }
    };

    return (
        <div className={"fullBackground"}>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className={styles.userSettingsContainer}>
                        <div className={styles.userSettingsNamesContainer}>
                            <h4>Paramètres</h4>
                            <div className={styles.settingsNamesContainer}>
                                {settingsNames.map((setting) => (
                                    <div
                                        key={`setting-${setting.name}`}
                                        className={`${styles.settingName} ${activeTab.name === setting.name ? styles.selectedSettingName : ""}`}
                                        onClick={() => setActiveTab(setting)}
                                    >
                                        <Image
                                            src={setting.iconPath}
                                            alt="Account icon"
                                            width={18}
                                            height={18}
                                        />
                                        <p>{setting.name}</p>
                                    </div>
                                ))}
                            </div>

                            <DefaultButton handleClick={() => signout()}>
                                <Image
                                    src="/icons/signout.svg"
                                    alt="Signout icon"
                                    width={18}
                                    height={18}
                                />
                                <p>Se déconnecter</p>
                            </DefaultButton>
                        </div>

                        <div className={styles.userSettingsContentContainer}>
                            <div className={styles.userSettingsContentHeader}>
                                <h1>{activeTab.name}</h1>
                                <button type={"button"} onClick={() => setModal(false)}>
                                    <Image
                                        src="/icons/close.svg"
                                        alt="Signout icon"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                            </div>

                            <div className={styles.userSettingsContent}>
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}