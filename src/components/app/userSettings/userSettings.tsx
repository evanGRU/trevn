import styles from "./userSettings.module.scss";
import React, {useState} from "react";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import Image from "next/image";
import AccountSettings from "@/components/app/userSettings/account/accountSettings";
import {motion} from "framer-motion";
import {Profile, SettingTab} from "@/utils/types";
import AvatarSettings from "@/components/app/userSettings/avatar/avatarSettings";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {createClient} from "@/utils/supabase/client";

interface UserSettingsProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    profile: Profile;
    refreshProfile: () => void;
}

const settingsTabs: SettingTab[] = [
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

export default function UserSettings({setModal, profile, refreshProfile}: UserSettingsProps) {
    const [activeTab, setActiveTab] = useState(settingsTabs[0]);
    const supabase = createClient();
    const router = useRouter();

    const settingsComponents: Record<string, React.ReactNode> = {
        account:
            <AccountSettings profile={profile} refreshProfile={refreshProfile}/>,
        avatar:
            <AvatarSettings profile={profile} refreshProfile={refreshProfile}/>
    };

    const handleChangeTab = (setting: SettingTab) => {
        setActiveTab(setting);
    }

    const signout = async () => {
        await supabase.auth.signOut()
        router.replace('/login');
    }

    return (
        <div className={"fullBackground"}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.userSettingsContainer}>
                    <div className={styles.userSettingsNamesContainer}>
                        <h4>Paramètres</h4>
                        <div className={styles.settingsNamesContainer}>
                            {settingsTabs.map((sTab) => (
                                <div
                                    key={`setting-${sTab.name}`}
                                    className={`${styles.settingName} ${activeTab.name === sTab.name ? styles.selectedSettingName : ""}`}
                                    onClick={() => handleChangeTab(sTab)}
                                >
                                    <Image
                                        src={sTab.iconPath}
                                        alt="Account icon"
                                        width={18}
                                        height={18}
                                    />
                                    <p>{sTab.name}</p>
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
                            {settingsComponents[activeTab.id]}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}