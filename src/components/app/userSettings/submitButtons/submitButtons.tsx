import styles from "./submitButtons.module.scss";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";
import GlassButton from "@/components/general/glassButton/glassButton";

interface SubmitButtonsProps {
    displayButtons: boolean;
    handleReset: React.MouseEventHandler<HTMLButtonElement>;
    handleSubmit: (newPassword?: string) => void;
    withBackground?: boolean;
    isDisabled?: boolean;
}

export default function SubmitButtons({displayButtons, handleReset, handleSubmit, withBackground = false, isDisabled = false}: SubmitButtonsProps) {

    return (
        <div className={`${styles.submitButtonsContainer} ${withBackground ? styles.withBackground : ""}`}>
            <AnimatePresence mode={"wait"}>
                {displayButtons && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.1 }}
                    >
                        <button
                            type={"button"}
                            className={styles.resetButton}
                            onClick={handleReset}
                            disabled={isDisabled}
                        >
                            Réinitialiser les changements
                        </button>

                        <GlassButton
                            type={"button"}
                            handleClick={() => handleSubmit()}
                            isDisabled={isDisabled}
                        >
                            Sauvegarder les changements
                        </GlassButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}