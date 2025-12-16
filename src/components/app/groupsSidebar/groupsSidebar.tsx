import styles from "./groupsSidebar.module.scss";
import Image from "next/image";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import {Group} from "@/utils/types";
import {DbImage} from "@/components/general/dbImage/dbImage";
import Link from "next/link";
import {useParams} from "next/navigation";

interface GroupsListProps {
    groups: Group[];
    setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GroupsSidebar({groups, setModalState}: GroupsListProps) {
    const params = useParams();
    const selectedGroupId = params.groupId;

    return (
        <aside className={styles.groupsListSection}>
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
                            <Link
                                key={`groupe-${g?.id}`}
                                className={`${styles.groupCard} ${g?.id === selectedGroupId ? styles.selectedGroup : ""}`}
                                href={`/groups/${g?.id}`}
                            >
                                <DbImage
                                    src={getPublicAvatarUrl(g?.avatar.type, g?.avatar.name)}
                                    alt="Group avatar"
                                    width={48}
                                    height={48}
                                />
                                <p>{g?.name}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {groups.length > 0 && (
                <div className={styles.newGroupButtonContainer}>
                    <DefaultButton handleClick={() => setModalState(true)}>
                        <Image
                            src="/icons/plus.svg"
                            alt="Plus icon"
                            width={20}
                            height={20}
                        />
                        Nouveau groupe
                    </DefaultButton>
                </div>
            )}
        </aside>
    )
}