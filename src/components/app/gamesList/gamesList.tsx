import styles from "./gamesList.module.scss";
import GlassButton from "@/components/general/glassButton/glassButton";
import SearchField from "@/components/general/searchField/searchField";
import {forwardRef, useImperativeHandle, useMemo, useRef, useState} from "react";
import AddGameModal from "@/components/app/addGameModal/addGameModal";
import {GameCapsuleData} from "@/utils/types";
import useSWR from "swr";
import {ParamValue} from "next/dist/server/request/params";
import {useDebounce} from "@/utils/useDebounce";
import GameCapsule from "@/components/app/gameCapsule/gameCapsule";
import { fetcher } from "@/utils/globalFunctions";

export type GamesListHandle = {
    enableScroll: () => void;
    disableScroll: () => void;
    isAtTop: () => boolean;
};

export const GamesList = forwardRef<GamesListHandle, {groupId: ParamValue}>(({groupId}, ref) => {
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const gamesRef = useRef<HTMLDivElement>(null);

    const { data: gamesList, isLoading, mutate: refreshGamesList } = useSWR(
        groupId ? `/api/games?groupId=${groupId}` : null,
        (url) => fetcher(url, "Impossible de récupérer la liste des jeux. Essaye de rafraîchir la page.")
    );

    const filteredGames = useMemo(() => {
        if (!gamesList) return [];

        const q = debouncedSearch.toLowerCase().trim();
        if (!q) return gamesList;

        return gamesList.filter((game: GameCapsuleData) =>
            game.name.toLowerCase().includes(q)
        );
    }, [gamesList, debouncedSearch]);

    useImperativeHandle(ref, () => ({
        enableScroll() {
            if (gamesRef.current) {
                gamesRef.current.style.overflowY = "scroll";
            }
        },
        disableScroll() {
            if (gamesRef.current) {
                gamesRef.current.style.overflowY = "hidden";
                gamesRef.current.scrollTop = 0;
            }
        },
        isAtTop() {
            return gamesRef.current?.scrollTop === 0;
        },
    }));

    return (
        <>
            <div className={styles.headerContainer}>
                <h2>Liste des jeux</h2>

                <div className={styles.headerButtonsContainer}>
                    <GlassButton type={"button"} handleClick={() => setIsAddGameModalOpen(true)}>Ajouter un jeu</GlassButton>
                    <SearchField search={search} setSearch={setSearch}/>
                </div>
            </div>


            <div ref={gamesRef} className={styles.gamesContentContainer}>
                {isLoading && (
                    <div className={styles.loader}>
                        <p>Chargement...</p>
                    </div>
                )}
                {filteredGames.length > 0 ? (
                    <div className={styles.gameCardContainer}>
                        {filteredGames?.map((game: GameCapsuleData) => (
                            <GameCapsule
                                key={`game-card-${game.id}`}
                                game={game}
                                groupId={groupId}
                                refreshGamesList={refreshGamesList}
                                gamesList={filteredGames}
                            />
                        ))}
                    </div>
                ) : (search && (
                        <div className={styles.noResults}>
                            <p>Aucun résultat trouvé pour &#34;{search}&#34;.</p>
                        </div>
                    )
                )}
            </div>

            {isAddGameModalOpen && (
                <AddGameModal
                    setModal={setIsAddGameModalOpen}
                    groupId={groupId}
                    refreshGamesList={refreshGamesList}
                />
            )}
        </>
    )
});

GamesList.displayName = "GamesList";