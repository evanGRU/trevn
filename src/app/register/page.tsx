'use client'

import SignupForm from "@/components/auth/SignUpForm";
import styles from "./page.module.scss";
import ButtonLink from "@/components/homepage/buttonLink/buttonLink";

export default function LoginPage() {
    return (

        <div className={styles.formsContainer}>
            <ButtonLink href={"/"}>TREVN</ButtonLink>

            <div className={styles.signupContainer}>
                <h3>Créer un compte</h3>
                <SignupForm />
            </div>
            <p>Vous avez déjà un compte. <a href="/login">Connectez-vous ici</a></p>
        </div>
    );
}
