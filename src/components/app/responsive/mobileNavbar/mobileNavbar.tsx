import styles from "./mobileNavbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import {DbImage} from "@/components/general/dbImage/dbImage";
import {Profile} from "@/utils/types";

export default function MobileNavbar({profile, activeMenu} : {profile: Profile, activeMenu: string}) {
    return (
        <div className={styles.mobileNavbarBackground}>
            <div className={styles.mobileNavbar}>
                <Link href={"/groups"}>
                    <Image src={`/icons/mobileNavbar/groups${activeMenu === "groups" ? "Selected" : ""}.svg`} alt={"Groups icon"} width={28} height={28}/>
                    <p className={activeMenu === "groups" ? styles.activeText : ""}>Groupes</p>
                </Link>

                <Link href={""}>
                    <DbImage
                        src={getPublicAvatarUrl("users", profile?.avatar.name)}
                        alt={"User avatar"}
                        width={28}
                        height={28}
                        className={`${styles.pp} ${activeMenu === "userSettings" ? styles.activePp : ""}`}
                    />
                    <p className={activeMenu === "userSettings" ? styles.activeText : ""}>Toi</p>
                </Link>
            </div>
        </div>
    );
}