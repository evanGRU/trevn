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
import {AnimatePresence, motion} from "framer-motion";

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
    maxIsTablet: boolean;
}

export default function GroupsSidebar({groups, setModalState, isLoading, maxIsTablet}: GroupsListProps) {
    const params = useParams();
    const selectedGroupId = params.groupId;
    const [groupsAreLoading, setGroupsAreLoading] = useState(true);
    const totalGroups = groups.length;

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
                <div className={styles.groupsTitle}>
                    <h4>Tous tes groupes</h4>
                </div>

                {groupsAreLoading ? (
                    <div className={styles.groupsList}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                animation={false}
                                width={"100%"}
                                height={maxIsTablet ? 72 : 56}
                                style={{
                                    borderRadius: maxIsTablet ? 0 : "16px",
                                    marginBottom: maxIsTablet ? "4px" : 0,
                                    marginTop: maxIsTablet ? "4px" : 0
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className={styles.groupsList}
                        variants={containerVariants}
                        initial={"hidden"}
                        animate={"visible"}
                    >
                        <AnimatePresence>
                            {(groups.map((g: Group, index: number) => (
                                <motion.div
                                    key={`groupe-${g?.id}`}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <Link
                                        className={`
                                        ${styles.groupCard} 
                                        ${!maxIsTablet && g?.id === selectedGroupId ? styles.selectedGroup : ""} 
                                        ${maxIsTablet && index === (totalGroups - 1) ? styles.lastGroupCard : ""}
                                    `}
                                        href={`/groups/${g?.id}`}
                                    >
                                        <div className={styles.groupCardDetails}>
                                            <DbImage
                                                src={getPublicAvatarUrl(g?.avatar.type, g?.avatar.name)}
                                                alt="Group avatar"
                                                width={48}
                                                height={48}
                                            />
                                            <p>{g?.name}</p>
                                        </div>

                                        {maxIsTablet && (
                                            <div className={styles.groupCardArrowContainer}>
                                                <p>{g?.games_count}</p>
                                                <Image src="/icons/arrowRight.svg" alt="Right arrow icon" width={24} height={24}/>
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>
                            )))}
                        </AnimatePresence>

                    </motion.div>
                )}

            </div>

            {!maxIsTablet && groups.length > 0 && (
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