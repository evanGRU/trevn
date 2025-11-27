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

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const [formValues, setFormValues] = useState<FormValues>({
        username: "",
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const checkEmailExistence = async (email: string) => {
        try {
            const res = await fetch("/api/checkUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            return data.exists;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const resetForm = (fields: (keyof FormValues)[]) => {
        setFormValues((prev) => {
            const updated = { ...prev };
            fields.forEach((field) => (updated[field] = ""));
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formValues.email,
                    password: formValues.password,
                });

                resetForm(["email", "password"]);

                if (error) {
                    setErrorMessage(error.message);
                } else {
                    router.push("/groups");
                }
            } else {
                const emailExists = await checkEmailExistence(formValues.email);

                if (emailExists) {
                    setErrorMessage(
                        "Impossible de créer un compte avec cet email. " +
                        "Essayez de réinitialiser votre mot de passe si " +
                        "vous possédez déjà un compte."
                    );
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
                    setErrorMessage(error.message);
                } else {
                    router.push("/login");
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
        }
    };

    return (
        <div className={styles.authPage}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={type}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
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
                            {!isLogin && <AuthField fieldType={"username"} formValues={formValues} setFormValues={setFormValues}/>}
                            <AuthField fieldType={"email"} formValues={formValues} setFormValues={setFormValues}/>
                            <AuthField fieldType={"password"} formValues={formValues} setFormValues={setFormValues}/>
                            {isLogin && (
                                <div className={styles.loginUtils}>
                                    <label>
                                        <input type="checkbox" />
                                        <span className={styles.checkmark}>
                                            <TickIcon/>
                                        </span>
                                        Se souvenir de moi
                                    </label>
                                    <p>Mot de passe oublié</p>
                                </div>
                            )}

                            <GlassButton type={"submit"} linkHref={""} iconPath={""}>
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
        </div>
    );
}
