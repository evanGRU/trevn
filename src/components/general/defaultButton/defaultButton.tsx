import styles from "./defaultButton.module.scss";
import {ReactNode} from "react";

type DefaultButtonProps = {
    children: ReactNode,
    handleClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

export default function DefaultButton({children, handleClick, disabled}: DefaultButtonProps) {

    return (
        <button onClick={handleClick} type={"button"} className={`${styles.defaultBtn} ${disabled ? styles.disabled : ""}`} disabled={disabled}>
            {children}
        </button>
    )
}