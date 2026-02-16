"use client";

import styles from "./page.module.scss";
import GlassButton from "@/components/general/glassButton/glassButton";
import { motion, AnimatePresence } from "framer-motion";
import {TickIcon} from "@/utils/svg";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useToasts} from "@/utils/helpers/useToasts";
import ForgotPasswordModal from "@/components/webPage/forgotPasswordModal/forgotPasswordModal";
import {isEmail} from "@/utils/globalFunctions";
import {AuthModes, UserErrorCode} from "@/utils/types";
import DefaultField from "@/components/general/defaultField/defaultField";
import {userPrompts} from "@/utils/prompts";
import MainModalHeader from "@/components/general/mainModalHeader/mainModalHeader";
import {useMediaQueries} from "@/utils/helpers/useMediaQueries";

interface FormValues {
    username: string;
    email: string;
    password: string;
}

export default function AuthForm({ type }: {type: AuthModes}) {
    const router = useRouter();
    const {isMobile} = useMediaQueries();
    const isLogin = type === "login";
    const {successToast, errorToast} = useToasts();
    const [formValues, setFormValues] = useState<FormValues>({
        username: "",
        email: "",
        password: ""
    });
    const [errorCode, setErrorCode] = useState<{ [key: string]: UserErrorCode }>({});
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const validateForm = () => {
        const errors: { [key: string]: UserErrorCode } = {};
        if (!formValues.email) {
            errors.email = "missingField"
        } else if (!isEmail(formValues.email)) {
            errors.email = "invalidFormat"
        }

        if (!formValues.password) {
            errors.password = "missingField"
        } else if (!isLogin && formValues.password.length < 6) {
            errors.password = "weakPassword"
        }

        if (!isLogin && !formValues.username) {
            errors.username = "missingField"
        } else if (!isLogin && (formValues.username).length < 3) {
            errors.username = "minCharacterLimit"
        }

        setErrorCode(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (isDisabled) return;
        setIsDisabled(true);

        try {
            const mode = isLogin ? 'login' : 'signup';

            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    email: formValues.email,
                    password: formValues.password,
                    username: formValues.username,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case 'invalid_credentials':
                        errorToast('Ton identifiant ou mot de passe est incorrect.');
                        break;
                    case 'email_not_confirmed':
                        errorToast("Ton email n'a pas encore été confirmé.");
                        break;
                    case 'weakPassword':
                        setErrorCode({ password: 'weakPassword' });
                        break;
                    case 'email_address_invalid':
                        errorToast("L'adresse email est invalide.");
                        break;
                    default:
                        errorToast("Une erreur est survenue lors de l'inscription. Si vous possédez déjà un compte ou si le problème persiste, vous pouvez tenter de réinitialiser votre mot de passe ou contacter le support.");
                }
                return;
            }

            if (isLogin) {
                router.push(`${redirect ?? "/groups"}`);
            } else {
                router.push(`/login${redirect ? `?redirect=${redirect}` : ''}`);
                successToast("Ton compte est prêt ! Vérifie ta boîte mail pour finaliser ton inscription.");
            }
        } catch (err) {
            console.error(err);
            errorToast('Une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            setIsDisabled(false);
        }
    }

    const handleResetPassword = async () => {
        if (!formValues.email) {
            setErrorCode({ email: "missingField" });
            return;
        } else if (!isEmail(formValues.email)) {
            setErrorCode({ email: "invalidFormat" });
            return;
        }
        setIsDisabled(true);

        try {
            await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formValues.email }),
            });

            setIsForgotPasswordModalOpen(true);
        } catch {
            errorToast('Une erreur s’est produite.');
        } finally {
            setIsDisabled(false);
        }
    }

    const handleChange = (field: keyof FormValues, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value
        }));

        if (!isLogin && value === "") {
            setErrorCode((prev) => ({ ...prev, [field]: "missingField" }))
        } else if (field === "username" && value.length > 20) {
            setErrorCode((prev) => ({ ...prev, [field]: "maxCharacterLimit" }))
        } else {
            setErrorCode((prev) => ({ ...prev, [field]: "" }))
        }
    };

    useEffect(() => {
        if (!isForgotPasswordModalOpen) {
            setFormValues({
                username: "",
                email: "",
                password: ""
            });
        }
    }, [isForgotPasswordModalOpen]);

    return (
        <div className={styles.authPage}>
            {isMobile && (
                <div className={styles.authHeader}>
                    <MainModalHeader hrefPath={"/"}>{"Accueil"}</MainModalHeader>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.formContainer}
                >
                    <div className={styles.formHeader}>
                        {!isMobile && (
                            <MainModalHeader hrefPath={"/"}>{"Accueil"}</MainModalHeader>
                        )}
                        <div className={styles.formHeaderTexts}>
                            <h1>{isLogin ? "Content de te revoir" : "Bienvenue parmi nous"}</h1>
                            <p>{isLogin
                                ? "Connecte-toi pour accéder à tes groupes."
                                : "Commence par créer ton compte."}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.fields}>
                            {!isLogin && (
                                <DefaultField
                                    type="username"
                                    value={formValues["username"]}
                                    handleChange={(e) => handleChange("username", e.target.value)}
                                    errorMessage={errorCode.username && userPrompts["username"].errors[errorCode.username]}
                                    label={isMobile ? "" : userPrompts["username"].label}
                                    placeholder={isMobile ? userPrompts["username"].label : userPrompts["username"].placeholder}
                                    isRequired={true}
                                    maxLength={20}
                                />
                            )}
                            <DefaultField
                                type="email"
                                value={formValues["email"]}
                                handleChange={(e) => handleChange("email", e.target.value)}
                                errorMessage={errorCode.email && userPrompts["email"].errors[errorCode.email]}
                                label={isMobile ? "" : userPrompts["email"].label}
                                placeholder={isMobile ? userPrompts["email"].label : userPrompts["email"].placeholder}
                                isRequired={true}
                            />
                            <DefaultField
                                type="password"
                                value={formValues["password"]}
                                handleChange={(e) => handleChange("password", e.target.value)}
                                errorMessage={errorCode.password && userPrompts["password"].errors[errorCode.password]}
                                label={isMobile ? "" : userPrompts["password"].label}
                                placeholder={isMobile ? userPrompts["password"].label : userPrompts["password"].placeholder}
                                isRequired={true}
                                autoFocus={false}
                            />
                        </div>
                        {isLogin && (
                            <div className={styles.loginUtils}>
                                <label>
                                    <input type="checkbox" />
                                    <span className={styles.checkmark}>
                                            <TickIcon/>
                                        </span>
                                    <p>Se souvenir de moi</p>
                                </label>
                                <button
                                    type={"button"}
                                    onClick={handleResetPassword}
                                    className={styles.forgotButton}
                                    disabled={isDisabled}
                                >
                                    Mot de passe oublié
                                </button>
                            </div>
                        )}

                        <GlassButton type={"submit"} isDisabled={isDisabled}>
                            {isLogin ? "Se connecter" : "S'inscrire"}
                        </GlassButton>
                    </form>

                    <div className={styles.formFooter}>
                        <p>
                            {isLogin
                                ? "Pas encore de compte ?"
                                : "Tu as déjà un compte ?"}
                        </p>
                        <a href={isLogin ? `/signup${redirect ? `?redirect=${redirect}` : ''}` : `/login${redirect ? `?redirect=${redirect}` : ''}`}>
                            {isLogin ? "Inscris-toi" : "Connecte-toi"}
                        </a>
                    </div>
                </motion.div>
            </AnimatePresence>

            {isForgotPasswordModalOpen && <ForgotPasswordModal setModal={setIsForgotPasswordModalOpen} email={formValues.email}/>}
        </div>
    );
}
