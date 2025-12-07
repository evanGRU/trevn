import styles from "./groupsList.module.scss";
import Image from "next/image";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import DefaultButton from "@/components/general/defaultButton/defaultButton";

type GroupMembers = {
    user_id: string;
}

type Avatar = {
    id: string;
    name: string;
    type: string;
}

type Group = {
    avatar: Avatar;
    description: string;
    groups_members: GroupMembers[];
    id: string;
    invite_code: string;
    name: string;
} | null

interface GroupsListProps {
    groups: Group[];
    setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GroupsList({groups, setModalState}: GroupsListProps) {

    return (
        <div className={styles.groupsListSection}>
            <div className={styles.groupsListContainer}>
                <div className={styles.groupsListHeader}>
                    <div className={styles.groupsTitle}>
                        <h4>Tous tes groupes</h4>
                    </div>

                    {/*<div className={styles.iconButton}>*/}
                    {/*    <Image*/}
                    {/*        src="/icons/order/orderDefault.svg"*/}
                    {/*        alt="Icône tri"*/}
                    {/*        width={18}*/}
                    {/*        height={18}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>

                {groups.length > 0 && (
                    <div className={styles.groupsList}>
                        {groups.map((g: Group) => (
                            <div key={`groupe-${g?.id}`} className={styles.groupCard}>
                                <Image
                                    src={getPublicAvatarUrl("group", g?.avatar?.name)}
                                    alt="Avatar"
                                    width={48}
                                    height={48}
                                />
                                <p>{g?.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {groups.length > 0 && (
                <div className={styles.newGroupButtonContainer}>
                    <DefaultButton handleClick={() => setModalState(true)}>
                        <Image
                            src="/icons/plus.svg"
                            alt="Icône ajout"
                            width={20}
                            height={20}
                        />
                        Nouveau groupe
                    </DefaultButton>
                </div>
            )}
        </div>
    )
}