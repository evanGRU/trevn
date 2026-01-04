import styles from "./optionsModal.module.scss";
import {motion} from "framer-motion";

export const OptionsModal = ({children}: {children: React.ReactNode}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.05 }}
            className={styles.optionsModalContainer}
        >
            {children}
        </motion.div>
    )
};