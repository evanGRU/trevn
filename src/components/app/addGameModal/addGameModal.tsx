import styles from "./addGameModal.module.scss";
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";
import Image from "next/image";
import {useState} from "react";
import {useDebounce} from "@/utils/useDebounce";
import useSWR, {KeyedMutator} from "swr";
import {GameResult, Profile} from "@/utils/types";
import {createClient} from "@/utils/supabase/client";
import {ParamValue} from "next/dist/server/request/params";

interface NewGroupModalProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    profile: Profile;
    groupId: ParamValue;
    refreshGamesList: KeyedMutator<GameResult[]>
}

export default function AddGameModal({setModal, profile, groupId, refreshGamesList}: NewGroupModalProps) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const supabase = createClient();

    const fetcher = (url: string) => fetch(url).then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
    });

    const { data, error, isValidating } = useSWR<GameResult[]>(
        debouncedQuery && debouncedQuery.trim().length > 1 ? `/api/games/search?q=${encodeURIComponent(debouncedQuery)}` : null,
        fetcher
    );

    const handleAddGame = async (game: GameResult) => {
        const { error } = await supabase.from("groups_games").insert({
            group_id: groupId,
            game_id: game.id,
            added_by: profile?.id,
        });

        if (error) {
            console.log('erreur :', error)
        }

        await refreshGamesList()
        setModal(false);
    }

    return (
        <ModalWrapper
            setModal={setModal}
            closeIconPosition={{
                top: "250px",
                right: "270px"
            }}
        >
            <div className={styles.searchGameField}>
                <input
                    type="text"
                    placeholder={"RECHERCHER UN JEU"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className={styles.iconButton}>
                    {query ? (
                        <button onClick={() => setQuery("")}>
                            <Image
                                src={"/icons/close.svg"}
                                alt={"Search icon"}
                                width={24}
                                height={24}
                            />
                        </button>
                    ) : (
                        <Image
                            src={"/icons/search.svg"}
                            alt={"Search icon"}
                            width={24}
                            height={24}
                        />
                    )}
                </div>
            </div>

            <div className={styles.searchGameResults}>


                <ul className={styles.gameResultsListContainer}>
                    {!data && (isValidating && <p className={styles.textSecondary}>Recherche…</p>)}
                    {(!isValidating && (data && data.length === 0 || !data && error)) && (
                        <p className={styles.textSecondary}>Aucun résultat</p>
                    )}
                    {data?.map(game => (
                        <li key={game.id} className={styles.gameResultCard}>
                            <button
                                onClick={() => handleAddGame(game)}
                            >
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={game.imageUrl}
                                        alt={game.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <p>{game.name}</p>
                            </button>
                        </li>
                    ))}
                    <div className={styles.gameResultsBackground}>
                        <Image
                            src={"/logo/logo_empty.svg"}
                            alt={"Logotype icon"}
                            height={30}
                            width={200}
                        />
                    </div>
                </ul>
            </div>
        </ModalWrapper>
    )
}