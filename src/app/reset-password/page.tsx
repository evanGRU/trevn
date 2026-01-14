'use client'

import React, { useState } from 'react'
import {useToasts} from "@/utils/helpers/useToasts";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import GlassButton from "@/components/general/glassButton/glassButton";
import DefaultField from "@/components/general/defaultField/defaultField";
import {resetPasswordPrompts} from "@/utils/prompts";
import {UserErrorCode} from "@/utils/types";
import styles from "./page.module.scss";
import MainModalHeader from "@/components/general/mainModalHeader/mainModalHeader";

interface FormValues {
    newPassword: string;
    newPasswordConfirm: string;
}

export default function ResetPasswordPage() {
    const {errorToast, successToast} = useToasts();
    const router = useRouter();

    const [formValues, setFormValues] = useState<FormValues>({
        newPassword: "",
        newPasswordConfirm: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorCode, setErrorCode] = useState<{ [key: string]: UserErrorCode }>({});

    const validateForm = () => {
        if (formValues.newPassword !== formValues.newPasswordConfirm) {
            errorCode.newPasswordConfirm = "samePassword";
            return false;
        } else if (formValues.newPassword.length < 6) {
            errorCode.newPasswordConfirm = "weakPassword";
            return false;
        }
        return true;
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (isLoading) return;
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: formValues.newPassword }),
            });

            const data = await res.json();
            if (data.error === "auth_missing") {
                errorToast('Nous n\'avons pas pu récupérer tes informations de session.');
                router.replace("/login");
                return;
            }

            if (!res.ok) {
                switch (data.error) {
                    case "same_password":
                        errorToast('Tu ne peux pas mettre le même mot de passe que le précédent.');
                        break;
                    case "weak_password":
                        errorToast('Ton mot de passe doit contenir au moins 6 caractères.');
                        break;
                    default:
                        errorToast('erreur');
                        break;
                }
                return;
            }

            router.replace("/login");
            successToast('Ton mot de passe a été mis à jour.');
        } catch {
            errorToast('Une erreur s’est produite.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (field: keyof FormValues, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value
        }));

        if (value === "") {
            setErrorCode((prev) => ({ ...prev, [field]: "missingField" }))
        } else {
            setErrorCode((prev) => ({ ...prev, [field]: "" }))
        }
    };

    return (
        <div className={styles.resetPage}>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.resetContainer}
                >
                    <div className={styles.resetHeader}>
                        <MainModalHeader hrefPath={"/login"}>{"Annuler"}</MainModalHeader>
                        <div className={styles.headerTitle}>
                            <h1>Réinitialiser ton mot de passe</h1>
                        </div>
                    </div>

                    <form onSubmit={handleResetPassword}>
                        <div className={styles.fields}>
                            <DefaultField
                                type="password"
                                value={formValues["newPassword"]}
                                handleChange={(e) => handleChange("newPassword", e.target.value)}
                                errorMessage={errorCode.newPassword && resetPasswordPrompts["newPassword"].errors[errorCode.newPassword]}
                                label={resetPasswordPrompts["newPassword"].label}
                                placeholder={resetPasswordPrompts["newPassword"].placeholder}
                                isRequired={true}
                            />
                            <DefaultField
                                type="password"
                                value={formValues["newPasswordConfirm"]}
                                handleChange={(e) => handleChange("newPasswordConfirm", e.target.value)}
                                errorMessage={errorCode.newPasswordConfirm && resetPasswordPrompts["newPasswordConfirm"].errors[errorCode.newPasswordConfirm]}
                                label={resetPasswordPrompts["newPasswordConfirm"].label}
                                placeholder={resetPasswordPrompts["newPasswordConfirm"].placeholder}
                                isRequired={true}
                                autoFocus={false}
                            />
                        </div>

                        <div className={styles.buttonsContainer}>
                            <GlassButton type={"submit"} isDisabled={isLoading}>
                                {"Réinitialiser"}
                            </GlassButton>
                        </div>
                    </form>

                </motion.div>
            </AnimatePresence>
        </div>
    )
}
