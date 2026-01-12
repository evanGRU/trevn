import styles from "./optionsButton.module.scss";

interface OptionsButtonProps {
    children: React.ReactNode;
    isWarningButton?: boolean;
    handleClick: () => void;
}

export const OptionsButton = ({children, isWarningButton = false, handleClick}: OptionsButtonProps) => {


    return (
        <button
            type={"button"}
            className={`${styles.optionsButton} ${isWarningButton ? styles.redText : ""}`}
            onClick={handleClick}
        >
            {children}
        </button>
    )
};