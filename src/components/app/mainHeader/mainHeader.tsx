import styles from "./mainHeader.module.scss";
import Link from "next/link";
import Image from "next/image";
import {DbImage} from "@/components/general/dbImage/dbImage";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import {Profile} from "@/utils/types";
import UserSettings from "@/components/app/userSettings/userSettings";
import {useState} from "react";
import {AnimatePresence} from "framer-motion";

export default function MainHeader({profile, refreshProfile}: {profile: Profile, refreshProfile: () => void}) {
    const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);

    return (
        <div className={styles.mainHeader}>
            <Link href={"/groups"}>
                <Image src="/logo/logotype_empty.svg" alt="Logotype" className={styles.logo} width={60} height={36}/>
            </Link>

            <div className={styles.profileContainer}>
                <div className={styles.usernameContainer}>
                    <DbImage
                        src={getPublicAvatarUrl("users", profile?.avatar.name)}
                        alt={"User avatar"}
                        width={28}
                        height={28}
                        className={styles.pp}
                    />
                    <p>{profile?.username}</p>
                </div>

                <button
                    type={"button"}
                    className={`glassButtonGlobal ${styles.glassIconButton}`}
                    onClick={() => setIsUserSettingsModalOpen(true)}
                >
                    <Image
                        src="/icons/gear.svg"
                        alt="Settings icon"
                        width={24}
                        height={24}
                    />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isUserSettingsModalOpen && (
                    <UserSettings setModal={setIsUserSettingsModalOpen} profile={profile} refreshProfile={refreshProfile}></UserSettings>
                )}
            </AnimatePresence>
        </div>
    );
}