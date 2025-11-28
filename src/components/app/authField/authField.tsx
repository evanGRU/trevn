import styles from "./authField.module.scss";
import {HiddenEyeIcon, VisibleEyeIcon} from "@/utils/svg";
import {useState} from "react";

const fieldPrompts = {
    username: {
        label: "Nom d'utilisateur",
        placeholder: "Entre ton nom d'utilisateur",
        errors: {
            missingField: "Nom d'utilisateur requis.",
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
    setFormValues: React.Dispatch<React.SetStateAction<{ username: string; email: string; password: string }>>;
    errorCode?: string;
}

export default function AuthField({fieldType, formValues, setFormValues, errorCode}: AuthFieldProps) {
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
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            [fieldType]: e.target.value,
                        })
                    }
                    required={true}
                    className={`${errorCode ? styles.requiredError : ""}`}
                />
                {fieldType === "password" && (
                    <div className={styles.fieldIcon} onClick={() => setIsPasswordHidden(!isPasswordHidden)}>
                        {isPasswordHidden ? <HiddenEyeIcon/> : <VisibleEyeIcon/>}
                    </div>
                )}
            </div>
            {errorCode && (
                <p className={styles.errorMessage}>{fieldPrompts[fieldType].errors[errorCode]}</p>
            )}
        </div>
    )
}