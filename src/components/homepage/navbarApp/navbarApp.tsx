import styles from "./navbarApp.module.scss";
import ButtonLink from "@/components/homepage/buttonLink/buttonLink";
import Image from "next/image";
import {logout} from "@/utils/auth";
import Link from "next/link";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";

type Profile = {
    username: string;
    avatar_url: string | null;
};

export default function NavbarApp({profile} : {profile: Profile | null}) {
    return (
        <div className={styles.navbar}>
            <ButtonLink href={'/groups'}>TREVN</ButtonLink>
            <div className={styles.buttonsContainer}>
                <div className={styles.profilContainer}>
                    <Image
                        src={getPublicAvatarUrl(profile?.avatar_url)}
                        alt={"Avatar"}
                        width={28}
                        height={28}
                        className={styles.pp}
                    />
                    <p>{profile?.username}</p>
                    <button onClick={logout}>
                        <Image
                            src={"/sign-out.svg"}
                            alt={"signOutIcon"}
                            width={24}
                            height={24}
                        />
                    </button>
                </div>
                <Link
                    href={'/settings'}
                    className={styles.iconButton}
                >
                    <Image
                        src={"/gear.svg"}
                        alt={"signOutIcon"}
                        width={24}
                        height={24}
                    />
                </Link>
            </div>
        </div>
    )
}