import styles from "./gameCapsule.module.scss";
import {GameCapsuleData, GroupDetails, Member} from "@/utils/types";
import Image from "next/image";
import {KeyedMutator} from "swr";
import React, {useState} from "react";
import Link from "next/link";
import {useToasts} from "@/utils/helpers/useToasts";
import LikeCounterIcon from "@/components/app/groupMenu/games/likeCounterIcon/likeCounterIcon";
import DeleteModal from "@/components/general/deleteModal/deleteModal";
import {AnimatePresence, motion} from "framer-motion";

interface GameCapsuleProps {
    game: GameCapsuleData;
    group: GroupDetails;
    refreshGamesList: KeyedMutator<GameCapsuleData[]>;
    gamesList: GameCapsuleData[];
    members: Member[];
    canDelete: boolean;
    canLike: boolean;
}

export default function GameCapsule({game, group, refreshGamesList, gamesList, members, canDelete, canLike}: GameCapsuleProps) {
    const [isLoading, setIsLoading] = useState(false);
    const {errorToast, successToast} = useToasts();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const toggleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const previousGames = gamesList;
        const newGames = previousGames.map(g =>
            g.id === game.id
                ? {
                    ...g,
                    is_liked: !g.is_liked,
                    likes_count: g.is_liked
                        ? g.likes_count - 1
                        : g.likes_count + 1,
                }
                : g
        )

        await refreshGamesList(newGames, false);
        try {
            const res = await fetch('/api/games/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId: group?.id,
                    gameId: game.id,
                }),
            })

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'cant_like_games':
                        errorToast('Les likes ont été bloqués dans ce groupe.')
                        break
                    default:
                        errorToast("Erreur lors de l'ajout ou de la suppression du like.")
                }
                await refreshGamesList(previousGames, false);
                return;
            }

            await refreshGamesList();
        } catch (err) {
            await refreshGamesList(previousGames, false);
            errorToast('Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const previousGames = gamesList;
        await refreshGamesList(
            gamesList.filter(g => g.id !== game.id),
            false
        );
        try {
            const res = await fetch('/api/games/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId: group?.id,
                    gameId: game.id,
                }),
            })

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'cant_delete_games':
                        errorToast('Tu n\'as pas la permission de supprimer un jeu de ce groupe.')
                        break
                    default:
                        errorToast("Erreur lors de la suppression du jeu.");
                }
                await refreshGamesList(previousGames, false);
                return;
            }

            setIsDeleteModalOpen(false);
            successToast(`Le jeu ${game.name} a bien été supprimé.`)
            await refreshGamesList();
        } catch (err) {
            await refreshGamesList(previousGames, false);
            console.error(err);
            errorToast('Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.gameCard}
            >
                <Image
                    src={game.imageUrl}
                    alt={game.name}
                    height={900}
                    width={600}
                    className={`${styles.mainImage} ${canLike ? "" : styles.fullOpacity}`}
                />

                <div className={styles.gameCardInterface}>
                    <div className={styles.topButtons}>
                        {canLike && (
                            <>
                                <button
                                    type={"button"}
                                    disabled={isLoading}
                                    className={`${styles.glass} ${styles.glassButton}`}
                                    onClick={toggleLike}
                                >
                                    <Image
                                        src={`/icons/${game.is_liked ? "likeFill" : "likeEmpty"}.svg`}
                                        alt={"Like Icon"}
                                        height={20}
                                        width={20}
                                    />
                                </button>

                                <div className={`${styles.glass} ${styles.glassCounter}`}>
                                    <h4>{game.likes_count > 1 ? game.likes_count + " likes" : game.likes_count + " like"}</h4>
                                    <LikeCounterIcon likes={game.likes_count} totalMembers={members.length}/>
                                </div>
                            </>
                    )}
                    </div>


                    <div className={styles.bottomButtons}>
                        <Link
                            href={`https://store.steampowered.com/app/${game.id}`}
                            target="_blank"
                            className={styles.glass}
                        >
                            Page steam
                        </Link>
                        {canDelete && (
                            <button
                                type={"button"}
                                className={`${styles.glass} ${styles.glassDeleteButton}`}
                                onClick={() => setIsDeleteModalOpen(true)}
                                disabled={isLoading}
                            >
                                <Image
                                    src={`/icons/trash.svg`}
                                    alt={"Trash Icon"}
                                    height={20}
                                    width={20}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode={"wait"}>
                {isDeleteModalOpen && (
                    <DeleteModal
                        setModal={setIsDeleteModalOpen}
                        handleDelete={handleDelete}
                        closeIconTopPosition={"128px"}
                    >
                        <h1>Supprimer un jeu</h1>
                        <p>En faisant cela, toutes les personnes ayant liké ce jeu devront le refaire si celui-ci est ajouté à nouveau.</p>
                        <h4>Es-tu sûr de vouloir supprimer ce jeu?</h4>
                    </DeleteModal>
                )}
            </AnimatePresence>
        </>
    )
}

