import styles from "./authField.module.scss";
import {HiddenEyeIcon, VisibleEyeIcon} from "@/utils/svg";
import {useState} from "react";
import {ErrorCode} from "@/utils/types";

type ErrorMessages = {
    missingField?: string;
    invalidFormat?: string;
    emailDoesNotExist?: string;
    weakPassword?: string;
    maxCharacterLimit?: string;
    minCharacterLimit?: string;
};

const fieldPrompts: Record<
    "username" | "email" | "password",
    {
        label: string;
        placeholder: string;
        errors: ErrorMessages;
    }
> = {
    username: {
        label: "Nom d'utilisateur",
        placeholder: "Entre ton nom d'utilisateur",
        errors: {
            missingField: "Nom d'utilisateur requis.",
            maxCharacterLimit: "Le nom d'utilisateur ne peux pas dépasser 20 caractères.",
            minCharacterLimit: "Le nom d'utilisateur requiert au moins 3 caractères."
        }
    },
    email: {
        label: "Email",
        placeholder: "Entre ton email",
        errors: {
            missingField: "Email requis.",
            invalidFormat: "Format d'email invalide.",
            emailDoesNotExist: "Adresse e-mail inexistante."
        }
    },
    password: {
        label: "Mot de passe",
        placeholder: "Entre ton mot de passe",
        errors: {
            missingField: "Mot de passe requis.",
            weakPassword: "Le mot de passe doit contenir au moins 6 caractères.",
        }
    },
};

interface AuthFieldProps {
    fieldType: "username" | "email" | "password";
    formValues: { username: string; email: string; password: string };
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    errorCode?: ErrorCode;
    maxLength?: number;
}

export default function AuthField({fieldType, formValues, handleChange, errorCode, maxLength}: AuthFieldProps) {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    return (
        <div className={styles.authField}>
            <label htmlFor={fieldType}>{fieldPrompts[fieldType].label} <span>*</span></label>
            <div className={styles.fieldContainer}>
                <input
                    id={fieldType}
                    name={fieldType}
                    value={formValues[fieldType]}
                    type={fieldType === "password" && isPasswordHidden ? "password" : (
                        fieldType === "email" ? "email" : "text"
                    )}
                    placeholder={fieldPrompts[fieldType].placeholder}
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
                <p className={"errorMessage"}>{fieldPrompts[fieldType].errors[errorCode]}</p>
            )}
        </div>
    )
}