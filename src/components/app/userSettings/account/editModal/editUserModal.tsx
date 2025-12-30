import React, {useMemo, useState} from "react";
import styles from "./editUserModal.module.scss";
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";
import DefaultField from "@/components/general/defaultField/defaultField";
import {UserErrorCode, UserProps} from "@/utils/types";
import {userPrompts} from "@/utils/prompts";
import GlassButton from "@/components/general/glassButton/glassButton";
import {createClient} from "@/utils/supabase/client";
import {useToasts} from "@/utils/useToasts";

interface EditUserModalProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>
    settingProp: UserProps | null;
    propValue: string | null | undefined;
    onSubmit: (key: UserProps | null, newValue: string | null | undefined) => void;
    onSubmitPassword: (newPassword: string) => void;
    email: string;
}
export default function EditUserModal({setModal, settingProp, propValue, onSubmit, onSubmitPassword, email}: EditUserModalProps) {
    const supabase = createClient();
    const [newValue, setNewValue] = useState(propValue);
    const [passwordValues, setPasswordValues] = useState({
        newPassword: "",
        confirmNewPassword: ""
    });

    const [isPasswordChecked, setIsPasswordChecked] = useState(false);
    const isConfirmPasswordForm = useMemo(() => (settingProp === "password" && !isPasswordChecked), [settingProp, isPasswordChecked]);
    const isNewPasswordForm = !isConfirmPasswordForm && settingProp === "password";

    const {errorToast} = useToasts();
    const [errorCode, setErrorCode] = useState<UserErrorCode>("");

    const validatePasswordForm = () => {
        if (!passwordValues.newPassword || !passwordValues.confirmNewPassword) {
            setErrorCode("missingField");
            return false;
        } else if (passwordValues.newPassword !== passwordValues.confirmNewPassword) {
            setErrorCode("notTheSame");
            return false;
        } else if (passwordValues.newPassword === newValue) {
            setErrorCode("samePassword");
            return false;
        } else if (passwordValues.newPassword.length < 6) {
            setErrorCode("weakPassword");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (settingProp === "password") {
            if (isConfirmPasswordForm) {
                if (!newValue) return;
                const {error} = await supabase.auth.signInWithPassword({ email, password: newValue });

                if (error) {
                    if (error.code === "invalid_credentials") {
                        errorToast('Ton mot de passe est incorrect.');
                    } else {
                        errorToast('Une erreur s\'est produite.');
                    }
                    setNewValue(null);
                    return;
                }

                setIsPasswordChecked(true);
                return;
            }

            if (!validatePasswordForm()) return;
            onSubmitPassword(passwordValues.newPassword);
            onSubmit(settingProp, "");

            setIsPasswordChecked(false);

            setModal(false);
            return;
        }

        onSubmit(settingProp, newValue);
        setModal(false);
    }

    const handleChange = ({fieldValue, passwordField = ""}: {fieldValue: string, passwordField: string}) => {
        if (isNewPasswordForm) {
            if (passwordField === "new") {
                setPasswordValues((prev) => ({
                    ...prev,
                    newPassword: fieldValue
                }));
            } else {
                setPasswordValues((prev) => ({
                    ...prev,
                    confirmNewPassword: fieldValue
                }));
            }
        } else {
            setNewValue(fieldValue);
        }

        if (fieldValue === "") {
            setErrorCode("missingField");
        } else if (settingProp === "username" && fieldValue.length > 20) {
            setErrorCode("maxCharacterLimit");
        } else {
            setErrorCode("");
        }
    }

    return settingProp && (
        <ModalWrapper
            setModal={setModal}
            closeIconTopPosition={(settingProp === "password") ? (isPasswordChecked ? "198px" : "162px") : "150px"}
        >
            <form className={styles.editUserModalContainer} onSubmit={handleSubmit}>
                <div className={styles.modalTitle}>
                    <h2>{userPrompts[settingProp].editTitle}</h2>

                    {isConfirmPasswordForm && (
                        <p className={styles.infoMessage}>Pour continuer, saisis d’abord ton mot de passe actuel.</p>
                    )}
                </div>

                <div className={styles.fieldsContainer}>
                    <DefaultField
                        type={(settingProp === "password") ? "password" : "text"}
                        label={isNewPasswordForm ? "Nouveau mot de passe" : userPrompts[settingProp].label}
                        value={isNewPasswordForm ? passwordValues.newPassword : newValue ?? ""}
                        handleChange={(e) => handleChange({fieldValue: e.target.value, passwordField: isNewPasswordForm ? "new" : ""})}
                        isRequired={true}
                        maxLength={(settingProp === "username") ? 20 : undefined}
                        errorMessage={errorCode && userPrompts[settingProp].errors[errorCode]}
                    />

                    {settingProp === "password" && isPasswordChecked && (
                        <DefaultField
                            type={(settingProp === "password") ? "password" : "text"}
                            label={"Confirme ton nouveau mot de passe"}
                            value={passwordValues.confirmNewPassword}
                            handleChange={(e) => handleChange({fieldValue: e.target.value, passwordField: "confirm"})}
                            autoFocus={false}
                            isRequired={true}
                        />
                    )}
                </div>

                <div className={styles.editUserButtonsContainer}>
                    <button
                        type={"button"}
                        className={styles.cancelButton}
                        onClick={() => setModal(false)}
                    >
                        Annuler
                    </button>
                    <span className={styles.submitButton}>
                        <GlassButton type={"submit"}>{isConfirmPasswordForm ? "Confirmer" : "Modifier"}</GlassButton>
                    </span>
                </div>
            </form>
        </ModalWrapper>
    );
}