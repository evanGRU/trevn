import styles from './deleteModal.module.scss';
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";
import DefaultField from "@/components/general/defaultField/defaultField";
import {useState} from "react";

interface DeleteGameModalProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: () => void;
    title: string;
    paragraphe: string;
    closeIconTopPosition: string;
    withInput?: boolean;
    deleteLabel?: string;
}

export default function DeleteModal({setModal, handleDelete, title, paragraphe, closeIconTopPosition, withInput = false, deleteLabel}: DeleteGameModalProps) {
    const [deleteValue, setDeleteValue] = useState('');
    const [disabled, setDisabled] = useState(!!withInput);

    const handleChange = (value: string) => {
        setDeleteValue(value);

        if (withInput) {
            if (value === "SUPPRIMER") {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    }

    return (
        <ModalWrapper setModal={setModal} closeIconTopPosition={closeIconTopPosition}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.paragraphe}>{paragraphe}</p>

            {withInput && (
                <DefaultField
                    type={"text"}
                    label={deleteLabel ?? ""}
                    placeholder={"SUPPRIMER"}
                    value={deleteValue}
                    handleChange={(e) => handleChange(e.target.value)}
                />
            )}
            <div className={styles.buttonContainer}>
                <button type={"button"} onClick={handleDelete} disabled={disabled} className={`${disabled ? styles.disabled : ""}`}>
                    Supprimer
                </button>
            </div>
        </ModalWrapper>
    );
}