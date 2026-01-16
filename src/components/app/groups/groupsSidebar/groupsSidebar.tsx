import styles from "./groupsSidebar.module.scss";
import Image from "next/image";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import DefaultButton from "@/components/general/defaultButton/defaultButton";
import {Group} from "@/utils/types";
import {DbImage} from "@/components/general/dbImage/dbImage";
import Link from "next/link";
import {useParams} from "next/navigation";
import {Skeleton} from "@mui/material";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
    }
};

interface GroupsListProps {
    groups: Group[];
    setModalState: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
}

export default function GroupsSidebar({groups, setModalState, isLoading}: GroupsListProps) {
    const params = useParams();
    const selectedGroupId = params.groupId;
    const [groupsAreLoading, setGroupsAreLoading] = useState(true);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!isLoading) {
            timeout = setTimeout(() => {
                setGroupsAreLoading(false);
            }, 200);
        }

        return () => clearTimeout(timeout);
    }, [isLoading]);

    return (
        <aside className={styles.groupsListSection}>
            <div className={styles.groupsListContainer}>
                <div className={styles.groupsListHeader}>
                    <div className={styles.groupsTitle}>
                        <h4>Tous tes groupes</h4>
                    </div>
                </div>


                    {groupsAreLoading ? (
                        <div className={styles.groupsList}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} variant="rectangular" animation={false} width={"100%"} height={56} style={{borderRadius: "10px"}}/>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className={styles.groupsList}
                            variants={containerVariants}
                            initial="hidden"
                            animate={groupsAreLoading ? "hidden" : "visible"}
                        >
                            {(groups.map((g: Group) => (
                                <motion.div key={`groupe-${g?.id}`} variants={itemVariants}>
                                    <Link
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
                                </motion.div>
                            )))}
                        </motion.div>
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