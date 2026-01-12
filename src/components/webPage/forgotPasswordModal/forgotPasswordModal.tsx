import styles from "./forgotPasswordModal.module.scss";
import GlassButton from "@/components/general/glassButton/glassButton";

export default function ForgotPasswordModal({setModal, email}: {setModal: React.Dispatch<React.SetStateAction<boolean>>, email: string}) {

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.textContainer}>
                    <h3>Instructions envoyées</h3>
                    <p>
                        Si un compte est associé à l&apos;adresse email <span>{email}</span>, un email de réinitialisation a été envoyé.
                        Pense à vérifier ta boîte de réception ainsi que tes courriers indésirables.
                    </p>
                </div>
                <div className={styles.buttonContainer}>
                    <GlassButton type={"button"} handleClick={() => setModal(false)}>
                        J&apos;ai compris
                    </GlassButton>
                </div>
            </div>
        </div>
    )
}