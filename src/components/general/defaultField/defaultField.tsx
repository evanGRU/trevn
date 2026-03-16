import styles from "./defaultField.module.scss";
import {HiddenEyeIcon, VisibleEyeIcon} from "@/utils/svg";
import {useState} from "react";

interface DefaultFieldProps {
    type: string;
    label: string;
    value: string;
    placeholder?: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    isRequired?: boolean;
    errorMessage?: string;
    maxLength?: number;
    autoFocus?: boolean;
    version?: string;
}

export default function DefaultField({type, label, value, placeholder, handleChange, isRequired, errorMessage, maxLength, autoFocus = true, version = "default"}: DefaultFieldProps) {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    return (
        <div className={styles.defaultField}>
            {label && (
                <label htmlFor={type}>{label} {isRequired && <span>*</span>}</label>
            )}
            <div className={`${styles.fieldContainer} ${version === "mobile" ? styles.mobileFieldContainer : ""}`}>
                <input
                    id={type}
                    value={value}
                    type={type === "password" && isPasswordHidden ? "password" : (
                        type === "email" ? "email" : "text"
                    )}
                    placeholder={placeholder}
                    onChange={handleChange}
                    required={isRequired}
                    autoCorrect="off"
                    autoComplete={type === "password" ? (
                        "new-password"
                    ) : type === "email" ? (
                        "username webauthn"
                    ) : "off"}
                    className={`${errorMessage ? styles.requiredError : ""}`}
                    maxLength={maxLength && (maxLength + 1)}
                    autoFocus={autoFocus}
                />
                {maxLength && (
                    <div className={styles.fieldInsideContainer}>
                        <p>{value.length}/{maxLength}</p>
                    </div>
                )}
                {type === "password" && (
                    <div className={styles.fieldInsideContainer} onClick={() => setIsPasswordHidden(!isPasswordHidden)}>
                        {isPasswordHidden ? <HiddenEyeIcon/> : <VisibleEyeIcon/>}
                    </div>
                )}
            </div>
            {version !== "mobile" && <p className={"errorMessage"}>{errorMessage ?? " "}</p>}
        </div>
    )
}