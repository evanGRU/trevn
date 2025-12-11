import styles from "./gamesList.module.scss";
import GlassButton from "@/components/general/glassButton/glassButton";
import SearchField from "@/components/general/searchField/searchField";
import {useState} from "react";
import AddGameModal from "@/components/app/addGameModal/addGameModal";

export default function GamesList() {
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);

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

            <div>

            </div>

            {isAddGameModalOpen && (
                <AddGameModal
                    setModal={setIsAddGameModalOpen}
                />
            )}
        </>
    )
}