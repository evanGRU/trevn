import styles from "./authField.module.scss";
import {HiddenEyeIcon, VisibleEyeIcon} from "@/utils/svg";
import {useState} from "react";

const fieldPrompts = {
    username: {
        label: "Nom d'utilisateur",
        placeholder: "Entre ton nom d'utilisateur",
    },
    email: {
        label: "Email",
        placeholder: "Entre ton email",
    },
    password: {
        label: "Mot de passe",
        placeholder: "Entre ton mot de passe",
    },
};

interface AuthFieldProps {
    fieldType: "username" | "email" | "password";
    formValues: { username: string; email: string; password: string };
    setFormValues: React.Dispatch<React.SetStateAction<{ username: string; email: string; password: string }>>;
}

export default function AuthField({fieldType, formValues, setFormValues}: AuthFieldProps) {
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
                />
                {fieldType === "password" && (
                    <div className={styles.fieldIcon} onClick={() => setIsPasswordHidden(!isPasswordHidden)}>
                        {isPasswordHidden ? <HiddenEyeIcon/> : <VisibleEyeIcon/>}
                    </div>
                )}
            </div>
        </div>
    )
}