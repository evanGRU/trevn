import styles from "./authField.module.scss";
import {HiddenEyeIcon, VisibleEyeIcon} from "@/utils/svg";
import {useState} from "react";
import {UserErrorCode, UserProps} from "@/utils/types";
import {userPrompts} from "@/utils/prompts";

interface AuthFieldProps {
    fieldType: UserProps;
    formValues: { username: string; email: string; password: string };
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    errorCode?: UserErrorCode;
    maxLength?: number;
}

export default function AuthField({fieldType, formValues, handleChange, errorCode, maxLength}: AuthFieldProps) {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    return (
        <div className={styles.authField}>
            <label htmlFor={fieldType}>{userPrompts[fieldType].label} <span>*</span></label>
            <div className={styles.fieldContainer}>
                <input
                    id={fieldType}
                    name={fieldType}
                    value={formValues[fieldType]}
                    type={fieldType === "password" && isPasswordHidden ? "password" : (
                        fieldType === "email" ? "email" : "text"
                    )}
                    placeholder={userPrompts[fieldType].placeholder}
                    autoCorrect="off"
                    autoComplete={fieldType === "password" ? (
                        "new-password"
                    ) : fieldType === "email" ? (
                        "username webauthn"
                    ) : "off"}
                    onChange={handleChange}
                    required={true}
                    className={`${errorCode ? styles.requiredError : ""}`}
                    maxLength={maxLength}
                />
                {fieldType === "password" && (
                    <div className={styles.fieldInsideContainer} onClick={() => setIsPasswordHidden(!isPasswordHidden)}>
                        {isPasswordHidden ? <HiddenEyeIcon/> : <VisibleEyeIcon/>}
                    </div>
                )}
                {fieldType === "username" && maxLength && (
                    <div className={styles.fieldInsideContainer}>
                        <p>{formValues["username"].length}/{maxLength - 1}</p>
                    </div>
                )}
            </div>
            {errorCode && (
                <p className={"errorMessage"}>{userPrompts[fieldType].errors[errorCode]}</p>
            )}
        </div>
    )
}