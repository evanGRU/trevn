import styles from "./addGameModal.module.scss";
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";
import Image from "next/image";
import {useState} from "react";
import {useDebounce} from "@/utils/helpers/useDebounce";
import {KeyedMutator} from "swr";
import {GameCapsuleData, GameResult} from "@/utils/types";
import {ParamValue} from "next/dist/server/request/params";
import {useToasts} from "@/utils/helpers/useToasts";
import {useSWRWithError} from "@/utils/helpers/useSWRWithError";

interface NewGroupModalProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    groupId: ParamValue;
    refreshGamesList: KeyedMutator<GameCapsuleData[]>;
}

export default function AddGameModal({setModal, groupId, refreshGamesList}: NewGroupModalProps) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const {errorToast} = useToasts();
    const [isLoading, setIsLoading] = useState(false);

    const {data, isValidating, error} = useSWRWithError<GameResult[]>(`/api/games/search?q=${encodeURIComponent(debouncedQuery)}`, {
        errorMessage: "Une erreur s'est produite en essayant d'ajouter un jeu à ce groupe.",
    });

    const handleAddGame = async (game: GameResult) => {
        if (!groupId) return;
        if (isLoading) return;
        setIsLoading(true);

        try {
            const res = await fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupId, gameId: game.id }),
            });

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'game_already_added':
                        errorToast('Ce jeu a déjà été ajouté à ce groupe.')
                        break
                    case 'cant_add_games':
                        errorToast('Tu n\'as pas la permission d\'ajouter un jeu dans ce groupe.')
                        break
                    default:
                        errorToast('Impossible d’ajouter le jeu.')
                }
                return
            }

            await refreshGamesList();
            setModal(false);
        } catch (err) {
            errorToast("Une erreur s'est produite.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ModalWrapper
            setModal={setModal}
            closeIconTopPosition={"250px"}
        >
            <div className={styles.searchGameField}>
                <input
                    type="text"
                    placeholder={"RECHERCHER UN JEU"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus={true}
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
                    {query && (!isValidating && (data && data.length === 0 || !data && error)) && (
                        <p className={styles.textSecondary}>Aucun résultat</p>
                    )}
                    {data?.map((game: GameResult) => (
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