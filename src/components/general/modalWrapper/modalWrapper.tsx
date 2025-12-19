import styles from "./modalWrapper.module.scss";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";

interface ModalProps {
    children: React.ReactNode;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    closeIconPosition: {
        top: string;
        right: string;
    }
}

export default function ModalWrapper({children, setModal, closeIconPosition}: ModalProps) {
    return (
        <div className={"fullBackground"}>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                            top: `calc(50% - ${closeIconPosition.top})`,
                            right: `calc(50% - ${closeIconPosition.right})`
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
            </AnimatePresence>
        </div>
    )
}