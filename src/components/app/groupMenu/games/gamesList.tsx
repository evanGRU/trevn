import styles from "./gamesList.module.scss";
import GlassButton from "@/components/general/glassButton/glassButton";
import SearchField from "@/components/general/searchField/searchField";
import {forwardRef, useImperativeHandle, useMemo, useRef, useState} from "react";
import AddGameModal from "@/components/app/groupMenu/games/addGameModal/addGameModal";
import {GameCapsuleData, GroupDetails, Member} from "@/utils/types";
import {useDebounce} from "@/utils/helpers/useDebounce";
import GameCapsule from "@/components/app/groupMenu/games/gameCapsule/gameCapsule";
import {AnimatePresence} from "framer-motion";
import MenuHeader from "@/components/app/groupMenu/menuHeader/menuHeader";
import {useRules} from "@/utils/helpers/useRules";
import {useSWRWithError} from "@/utils/helpers/useSWRWithError";
import {Skeleton} from "@mui/material";

export type GamesListHandle = {
    enableScroll: () => void;
    disableScroll: () => void;
    isAtTop: () => boolean;
};

interface GamesListProps {
    group: GroupDetails;
    members: Member[];
    userHaveRights: boolean;
}

export const GamesList = forwardRef<GamesListHandle, GamesListProps>(({group, members, userHaveRights}, ref) => {
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const gamesRef = useRef<HTMLDivElement>(null);
    const {canAddGamesRule, canDeleteGamesRule, canLikeGamesRule} = useRules(group);

    const {
        data: gamesList,
        isLoading: gamesListIsLoading,
        mutate: refreshGamesList
    } = useSWRWithError<GameCapsuleData[]>(`/api/games?groupId=${group?.id}`, {
        errorMessage: "Une erreur s'est produite en essayant de récupérer la liste des jeux de ce groupe.",
    });

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
            <MenuHeader title={"Liste des jeux"}>
                {(userHaveRights || canAddGamesRule) &&
                    <GlassButton type={"button"} handleClick={() => setIsAddGameModalOpen(true)}>Ajouter un jeu</GlassButton>
                }
                <SearchField search={search} setSearch={setSearch}/>
            </MenuHeader>

            <div ref={gamesRef} className={styles.gamesContentContainer}>
                {gamesListIsLoading ? (
                    <div className={styles.gameCardContainer}>
                        {Array.from({length: 9}).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                animation={false}
                                width={"100%"}
                                height={"18em"}
                                style={{borderRadius: "20px"}}
                            />
                        ))}
                    </div>
                ) : (filteredGames.length > 0 ? (
                    <div className={styles.gameCardContainer}>
                        <AnimatePresence mode={"popLayout"}>
                            {filteredGames?.map((game: GameCapsuleData) => (
                                <GameCapsule
                                    key={`game-card-${game.id}`}
                                    game={game}
                                    group={group}
                                    refreshGamesList={refreshGamesList}
                                    gamesList={filteredGames}
                                    members={members}
                                    canDelete={userHaveRights || canDeleteGamesRule}
                                    canLike={canLikeGamesRule}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (search && (
                    <div className={styles.noResults}>
                        <p>Aucun résultat trouvé pour &#34;{search}&#34;.</p>
                    </div>
                )))}
            </div>

            <AnimatePresence mode="wait">
                {isAddGameModalOpen && (
                    <AddGameModal
                        setModal={setIsAddGameModalOpen}
                        groupId={group?.id}
                        refreshGamesList={refreshGamesList}
                    />
                )}
            </AnimatePresence>
        </>
    )
});

GamesList.displayName = "GamesList";