import styles from "./defaultButton.module.scss";
import {ReactNode} from "react";

type DefaultButtonProps = {
    children: ReactNode,
    handleClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function DefaultButton({children, handleClick}: DefaultButtonProps) {

    return (
        <button onClick={handleClick} type={"button"} className={styles.defaultBtn}>
            {children}
        </button>
    )
}