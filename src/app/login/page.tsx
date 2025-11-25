'use client'

import LoginForm from "@/components/auth/LoginForm";
import styles from "./page.module.scss";
import ButtonLink from "@/components/homepage/buttonLink/buttonLink";

export default function LoginPage() {
    return (

        <div className={styles.formsContainer}>
            <ButtonLink href={"/"}>TREVN</ButtonLink>
            <div className={styles.loginContainer}>
                <h3>Connexion</h3>
                <LoginForm />
            </div>
            <p>Pas encore de compte. <a href="/register">Inscrivez-vous ici</a></p>
        </div>
    );
}
