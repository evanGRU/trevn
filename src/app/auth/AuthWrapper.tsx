"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import AuthField from "@/components/app/authField/authField";
import GlassButton from "@/components/webPage/glassButton/glassButton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {TickIcon} from "@/utils/svg";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useAuthToast} from "@/utils/useAuthToast";
import ForgotPasswordModal from "@/components/app/forgotPasswordModal/forgotPasswordModal";
import {doesEmailExist, isEmail} from "@/utils/globalFunctions";

type Type = "login" | "signup";

interface FormValues {
    username: string;
    email: string;
    password: string;
}

export default function AuthForm({ type }: {type: Type}) {
    const supabase = createClient();
    const router = useRouter();
    const isLogin = type === "login";
    const {signupToast, errorToast} = useAuthToast();
    const [formValues, setFormValues] = useState<FormValues>({
        username: "",
        email: "",
        password: ""
    });
    const [errorCode, setErrorCode] = useState<{ [key: string]: string }>({});
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!formValues.email) {
            errors.email = "fieldMissing"
        } else if (!isEmail(formValues.email)) {
            errors.email = "invalidFormat"
        }

        if (!formValues.password) {
            errors.password = "fieldMissing"
        } else if (!isLogin && formValues.password.length < 6) {
            errors.password = "weakPassword"
        }

        if (!isLogin && !formValues.username) {
            errors.username = "fieldMissing"
        }

        setErrorCode(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formValues.email,
                    password: formValues.password,
                });

                if (error) {
                    console.log(error);
                    errorToast("Ton identifiant ou ton mot de passe est incorrecte.");
                } else {
                    router.push("/groups");
                }
            } else {
                const emailExists = await doesEmailExist(formValues.email);
                if (emailExists) {
                    errorToast(
                        "Impossible de créer un compte avec cet email. Essayez de réinitialiser votre mot de passe si vous possédez déjà un compte."
                    );
                    return;
                }

                if ((formValues.password).length < 6) {
                    setErrorCode({
                        ...errorCode,
                        password: "weakPassword"
                    });
                    return;
                }

                const { error } = await supabase.auth.signUp({
                    email: formValues.email,
                    password: formValues.password,
                    options: {
                        data: { username: formValues.username },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) {
                    errorToast(error.message);
                } else {
                    router.push("/login");
                    signupToast()
                }
            }
        } catch (err) {
            console.error(err);
            errorToast("Une erreur est survenue. Veuillez réessayer plus tard.");
        }
    };

    const handleResetPassword = async () => {
        if (!formValues.email) {
            setErrorCode({ email: "missingField" });
            return;
        } else if (!isEmail(formValues.email)) {
            setErrorCode({ email: "invalidFormat" });
            return;
        }

        const emailExists = await doesEmailExist(formValues.email);
        if (!emailExists) {
            setErrorCode({ email: "emailDoesNotExist" });
            return;
        }



        const { error } = await supabase.auth.resetPasswordForEmail(formValues.email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            switch (error.code) {
                case "validation_failed":
                    errorToast("Impossible de valider l'adresse email, vérifiez son format.");
                    return;
                default:
                    errorToast("Une erreur s'est produite, veuillez réessayer plus tard.");
                    return;
            }
        }
        setIsForgotPasswordModalOpen(true);
    };

    const handleChange = (field: keyof FormValues, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value
        }));

        if (!isLogin && value === "") {
            setErrorCode((prev) => ({ ...prev, [field]: "missingField" }))
        } else {
            setErrorCode((prev) => ({ ...prev, [field]: "" }))
        }
    };

    return (
        <div className={styles.authPage}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <Link href={"/"}>
                                <Image
                                    src="/logo/Logotype_empty.svg"
                                    alt="Logotype Trevn"
                                    width={80}
                                    height={50}
                                />
                            </Link>
                            <div className={styles.formHeaderTexts}>
                                <h1>{isLogin ? "Content de te revoir !" : "Bienvenue !"}</h1>
                                <p>
                                    {isLogin
                                        ? "Connecte-toi pour accéder à tes groupes."
                                        : "Crée ton compte pour commencer."}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <AuthField
                                    fieldType="username"
                                    formValues={formValues}
                                    setFormValues={(v) => handleChange("username", v.username)}
                                    errorCode={errorCode.username}
                                />
                            )}
                            <AuthField
                                fieldType="email"
                                formValues={formValues}
                                setFormValues={(v) => handleChange("email", v.email)}
                                errorCode={errorCode.email}
                            />
                            <AuthField
                                fieldType="password"
                                formValues={formValues}
                                setFormValues={(v) => handleChange("password", v.password)}
                                errorCode={errorCode.password}
                            />
                            {isLogin && (
                                <div className={styles.loginUtils}>
                                    <label>
                                        <input type="checkbox" />
                                        <span className={styles.checkmark}>
                                            <TickIcon/>
                                        </span>
                                        Se souvenir de moi
                                    </label>
                                    <button type={"button"} onClick={handleResetPassword} className={styles.forgotButton}>Mot de passe oublié</button>
                                </div>
                            )}

                            <GlassButton type={"submit"}>
                                {isLogin ? "Se connecter" : "S'inscrire"}
                            </GlassButton>
                        </form>

                        <div className={styles.formFooter}>
                            <p>
                                {isLogin
                                    ? "Vous n'avez pas encore de compte?"
                                    : "Vous avez déjà un compte?"}
                            </p>
                            <a href={isLogin ? "/signup" : "/login"}>
                                {isLogin ? "Inscrivez-vous" : "Connectez-vous"}
                            </a>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {isForgotPasswordModalOpen && <ForgotPasswordModal setModal={setIsForgotPasswordModalOpen} email={formValues.email}/>}
        </div>
    );
}
