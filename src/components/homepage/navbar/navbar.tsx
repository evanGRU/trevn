import styles from "./navbar.module.scss";
import ButtonLink from "@/components/homepage/buttonLink/buttonLink";

export default function Navbar() {
    return (
        <div className={styles.navbarContainer}>
            <p>TREVN</p>

            <div className={styles.navbarButtonsContainer}>
                <ButtonLink href={"/login"}>
                    Se connecter
                </ButtonLink>
                <ButtonLink href={"/login"} variant={"secondary"}>
                    S&apos;inscrire
                </ButtonLink>
            </div>
        </div>
    );
}
