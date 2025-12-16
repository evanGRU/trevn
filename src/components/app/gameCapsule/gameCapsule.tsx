import styles from "./gameCapsule.module.scss";
import {GameCapsuleData} from "@/utils/types";
import Image from "next/image";
import {KeyedMutator} from "swr";
import {ParamValue} from "next/dist/server/request/params";
import {useState} from "react";

interface GameCapsuleProps {
    game: GameCapsuleData;
    groupId: ParamValue;
    refreshGamesList: KeyedMutator<GameCapsuleData[]>;
}

export default function GameCapsule({game, groupId, refreshGamesList}: GameCapsuleProps) {
    const [likeIsLoading, setLikeIsLoading] = useState(false);

    const toggleLike = async () => {
        setLikeIsLoading(true);
        await fetch('/api/games/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId,
                gameId: game.id,
            }),
        })
        await refreshGamesList();
        setLikeIsLoading(false);
    }

    return (
        <div className={styles.gameCard}>
            <Image
                src={game.imageUrl}
                alt={game.name}
                height={900}
                width={600}
                className={styles.mainImage}
            />

            <div className={styles.gameCardInterface}>
                <div className={styles.topButtons}>
                    <button
                        type={"button"}
                        disabled={likeIsLoading}
                        className={`${styles.glassElement} ${styles.glassButton}`}
                        onClick={toggleLike}
                    >
                        <Image
                            src={`/icons/${game.is_liked ? "likeFill" : "likeEmpty"}.svg`}
                            alt={"Like Icon"}
                            height={20}
                            width={20}
                        />
                    </button>

                    <div className={styles.glassElement}>
                        <h4>{game.likes_count}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

