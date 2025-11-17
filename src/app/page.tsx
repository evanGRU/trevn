import styles from "./page.module.scss";
import Navbar from "@/components/homepage/navbar/navbar";

export default function Home() {
  return (
    <>
        <Navbar/>
        <div className={styles.heroContainer}>
            <div className={styles.textSection}>
                <div className={styles.texts}>
                    <h1>Choisissez ensemble à quoi jouer ce soir.</h1>
                    <div>
                        <p>La plateforme qui centralise vos idées de jeux, vos avis et vos soirées entre amis.</p>
                        <p>Fini les débats avec vos amis sur Discord : trouvez le jeu parfait en quelques clics.</p>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}
