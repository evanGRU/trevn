import styles from "./modalWrapper.module.scss";
import Image from "next/image";
import {motion} from "framer-motion";

interface ModalProps {
    children: React.ReactNode;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    closeIconTopPosition: string;
}

export default function ModalWrapper({children, setModal, closeIconTopPosition}: ModalProps) {
    return (
        <div className={"fullBackground"}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.modalContainer}>
                    {children}
                </div>

                <button
                    type={"button"}
                    className={styles.closeModalIcon}
                    onClick={() => setModal(false)}
                    style={{
                        top: `calc(50% - ${closeIconTopPosition})`,
                        right: "calc(50% - 270px)"
                    }}
                >
                    <Image
                        src="/icons/close.svg"
                        alt="Close icon"
                        width={24}
                        height={24}
                    />
                </button>
            </motion.div>
        </div>
    )
}