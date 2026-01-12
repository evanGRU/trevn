import styles from "./customCheckboxSlide.module.scss";
import React, {useState} from "react";

export default function CustomCheckboxSlide({isCheckboxCheck, handleChange, isDisabled}: {isCheckboxCheck: boolean, handleChange: () => void, isDisabled: boolean}) {
    const [isCheck, setIsCheck] = useState(isCheckboxCheck);
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
        setIsCheck(prev => !prev);
        handleChange();
    };

    const handleMouseLeave = () => {
        setIsPressed(false);
    };

    return (
        <button
            type={"button"}
            className={`
               ${styles.checkboxContainer}
               ${isCheck ? styles.isCheck : ""}
               ${isPressed ? styles.isPressed : ""}
               ${isDisabled ? styles.isDisabled : ""}
            `}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            role={"switch"}
            aria-checked={isCheck}
            disabled={isDisabled}
        >
            <span className={styles.checkbox}></span>
        </button>
    )
}