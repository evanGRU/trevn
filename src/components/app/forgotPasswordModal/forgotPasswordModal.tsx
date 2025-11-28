import styles from "./forgotPasswordModal.module.scss";
import GlassButton from "@/components/webPage/glassButton/glassButton";

export default function ForgotPasswordModal({setModal, email}: {setModal: React.Dispatch<React.SetStateAction<boolean>>, email: string}) {

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.textContainer}>
                    <h3>Instructions envoyées</h3>
                    <p>
                        Nous avons envoyé des instructions pour réinitialiser ton mot de passe à l&apos;adresse email <span>{email}</span>.
                        Pense à vérifier ta boîte de réception ainsi que tes courriers indésirables. Si tu ne reçois rien tu as probablement
                        renseigné une adresse email invalide.
                    </p>
                </div>
                <div className={styles.buttonContainer}>
                    <GlassButton type={"button"} handleClick={setModal}>
                        J&apos;ai compris
                    </GlassButton>
                </div>
            </div>
        </div>
    )
}