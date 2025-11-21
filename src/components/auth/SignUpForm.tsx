"use client";

import {useEffect, useState} from "react";
import { createClient } from "@/utils/supabase/client";
import {useRouter} from "next/navigation";

const defaultSignUpForm = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function SignupForm() {
    const supabase = createClient();
    const router = useRouter();

    const [signupForm, setSignupForm] = useState(defaultSignUpForm);

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const checkEmailExists = async (email: string) => {
        const res = await fetch("/api/checkUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        return data.exists;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (signupForm.password !== signupForm.confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);

        const doesEmailExists = await checkEmailExists(signupForm.email);
        if (doesEmailExists) {
            setErrorMessage(
                "Impossible de créer un compte avec cet email. Essayez de réinitialiser votre mot de passe si vous possédez déjà un compte."
            );
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email: signupForm.email,
            password: signupForm.password,
            options: {
                data: {username: signupForm.username},
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            router.push("/login");
        }

        setLoading(false);
        setSignupForm(defaultSignUpForm);
    };

    useEffect(() => {
        const clearMessages = () => {
            setErrorMessage("");
        }

        if (errorMessage) {
            clearMessages();
        }
    }, [signupForm]);

    return (
        <form onSubmit={handleSignup}>
            <input
                type="username"
                placeholder="Nom d'utilisateur"
                value={signupForm.username}
                onChange={(e) =>
                    setSignupForm({
                        ...signupForm,
                        username: e.target.value,
                    })
                }
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={signupForm.email}
                onChange={(e) =>
                    setSignupForm({
                        ...signupForm,
                        email: e.target.value,
                    })
                }
                required
            />

            <input
                type="password"
                placeholder="Mot de passe"
                value={signupForm.password}
                onChange={(e) =>
                    setSignupForm({
                        ...signupForm,
                        password: e.target.value,
                    })
                }
                required
            />

            <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={signupForm.confirmPassword}
                onChange={(e) =>
                    setSignupForm({
                        ...signupForm,
                        confirmPassword: e.target.value,
                    })
                }
                required
            />

            <button
                type="submit"
                disabled={loading}
            >
                Créer un compte
            </button>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
}
