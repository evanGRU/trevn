import styles from "./searchGameModal.module.scss";
import {useState} from "react";

export default function SearchGameModal() {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([
        {
            name: "Game01",
        },
        {
            name: "Game02",
        },
        {
            name: "Game03",
        },
    ]);

    return (
        <div className={styles.editModalBackground}>
            <div className={styles.searchInput}>
                <input
                    type="text"
                    placeholder="Rechercher un jeu"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className={styles.searchResults}>
                <h4>Résultats</h4>
                <div className={styles.searchResultsList}>
                    {searchResults.map((game, index) => (
                        <div key={index} className={styles.searchResultsCard}>
                            <p>{game.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
