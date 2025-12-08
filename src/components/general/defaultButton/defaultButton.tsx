import styles from "./defaultButton.module.scss";
import {ReactNode} from "react";

type DefaultButtonProps = {
    children: ReactNode,
    handleClick?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DefaultButton({children, handleClick}: DefaultButtonProps) {

    return (
        <button onClick={() => handleClick && handleClick(false)} type={"button"} className={styles.defaultBtn}>
            {children}
        </button>
    )
}