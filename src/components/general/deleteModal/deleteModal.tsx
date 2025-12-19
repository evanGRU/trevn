import styles from './deleteModal.module.scss';
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";

interface DeleteGameModalProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: React.MouseEventHandler<HTMLButtonElement>;
    title: string;
    paragraphe: string;
}

export default function DeleteModal({setModal, handleDelete, title, paragraphe}: DeleteGameModalProps) {
    return (
        <ModalWrapper setModal={setModal} closeIconPosition={{top: '152px', right: '270px'}}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.paragraphe}>{paragraphe}</p>
            <div className={styles.buttonContainer}>
                <button type={"button"} onClick={handleDelete} >
                    Supprimer
                </button>
            </div>
        </ModalWrapper>
    );
}