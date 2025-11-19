import LoginForm from "@/components/auth/LoginForm";
import OauthButtons from "@/components/auth/OauthButtons";
import SignupForm from "@/components/auth/SignUpForm";
import styles from "./page.module.scss";

export default function LoginPage() {
    return (
        <div className={styles.formsContainer}>
            <div className={styles.loginContainer}>
                <h3>Connexion</h3>
                <LoginForm />
            </div>

            <div className={styles.signupContainer}>
                <h3>Créer un compte</h3>
                <SignupForm />
            </div>

            <div className={styles.oauthContainer}>
                <h3>Ou</h3>
                <OauthButtons />
            </div>
        </div>
    );
}
