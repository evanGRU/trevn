import styles from "./customToast.module.scss";
import Image from "next/image";

type iconType = "success" | "error";

interface ToastContentProps {
    title: string;
    type: iconType;
}

export default function CustomToast({title, type}: ToastContentProps) {
    const getIconPath = () => {
        switch (type) {
            case "success":
                return "/icons/successIcon.svg";
            case "error":
                return "/icons/errorIcon.svg";
            default:
                return "/icons/successIcon.svg";
        }
    }

    return (
        <div className={styles.toastContainer}>
            <div className={styles.toastIcon}>
                <Image
                    src={getIconPath()}
                    alt="Logotype Trevn"
                    width={32}
                    height={32}
                />
            </div>
            <p className={styles.title}>{title}</p>
        </div>
    )
}