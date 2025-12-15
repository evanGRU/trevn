import styles from "./gamesList.module.scss";
import GlassButton from "@/components/general/glassButton/glassButton";
import SearchField from "@/components/general/searchField/searchField";
import {useState} from "react";
import AddGameModal from "@/components/app/addGameModal/addGameModal";
import {GameResult, Profile} from "@/utils/types";
import useSWR from "swr";
import Image from "next/image";
import {ParamValue} from "next/dist/server/request/params";
import {useToasts} from "@/utils/useToasts";

export default function GamesList({profile, groupId} : {profile: Profile, groupId: ParamValue}) {
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const {errorToast} = useToasts();

    const { data: gamesList, error, isLoading, mutate: refreshGamesList } = useSWR(
        groupId ? `/api/games/list?groupId=${groupId}` : null,
        (url) => fetch(url).then(r => r.json())
    );

    if (error) {
        errorToast('Une erreur a eu lieu lors de la récupération des jeux. Essayer de rafraîchir la page.')
    }

    const handleChangeSearch = (e: any) => {
        console.log(e.target.value);
    }

    return (
        <>
            <div className={styles.headerContainer}>
                <h2>Liste des jeux</h2>

                <div className={styles.headerButtonsContainer}>
                    <GlassButton type={"button"} handleClick={() => setIsAddGameModalOpen(true)}>Ajouter un jeu</GlassButton>
                    <SearchField onChange={handleChangeSearch}/>
                </div>
            </div>

            <div className={styles.gameCardContainer}>
                {isLoading && <p>Chargement...</p>}
                {gamesList?.map((game: GameResult) => (
                    <div key={`game-card-${game.id}`} className={styles.gameCard}>
                        <Image
                            src={game.imageUrl}
                            alt={game.name}
                            height={87}
                            width={231}
                        />
                    </div>
                ))}
            </div>

            {isAddGameModalOpen && (
                <AddGameModal
                    setModal={setIsAddGameModalOpen}
                    profile={profile}
                    groupId={groupId}
                    refreshGamesList={refreshGamesList}
                />
            )}
        </>
    )
}