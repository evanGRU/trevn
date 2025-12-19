import styles from "./mainHeader.module.scss";
import Link from "next/link";
import Image from "next/image";
import {DbImage} from "@/components/general/dbImage/dbImage";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import {Profile} from "@/utils/types";
import UserSettings from "@/components/app/userSettings/userSettings";
import {useState} from "react";

export default function MainHeader({profile}: {profile: Profile}) {
    const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);

    return (
        <div className={styles.mainHeader}>
            <Link href={"/groups"}>
                <Image src="/logo/logotype_empty.svg" alt="Logotype" className={styles.logo} width={60} height={36}/>
            </Link>

            <div className={styles.profileContainer}>
                <div className={styles.usernameContainer}>
                    <DbImage
                        src={getPublicAvatarUrl("users", profile?.avatar_url)}
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

            {isUserSettingsModalOpen && (
                <UserSettings setModal={setIsUserSettingsModalOpen} profile={profile}></UserSettings>
            )}
        </div>
    );
}