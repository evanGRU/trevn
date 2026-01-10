import styles from './deleteModal.module.scss';
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";
import DefaultField from "@/components/general/defaultField/defaultField";
import {useState} from "react";

interface DeleteGameModalProps {
    children: React.ReactNode;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: () => void;
    closeIconTopPosition: string;
    withInput?: boolean;
    deleteLabel?: string;
}

export default function DeleteModal({children, setModal, handleDelete, closeIconTopPosition, withInput = false, deleteLabel}: DeleteGameModalProps) {
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
            <div className={styles.texts}>
                {children}
            </div>

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