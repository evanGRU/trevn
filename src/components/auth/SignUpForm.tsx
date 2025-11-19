"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SignupForm() {
    const supabase = createClient();

    const [signupForm, setSignupForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        // Vérification des mots de passe
        if (signupForm.password !== signupForm.confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email: signupForm.email,
            password: signupForm.password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        setLoading(false);

        if (error) {
            setErrorMessage(error.message);
        } else {
            alert("Un email de confirmation a été envoyé.");
        }
    };

    return (
        <form onSubmit={handleSignup}>
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

            <button type="submit" disabled={loading}>
                {loading ? "Création du compte..." : "Créer un compte"}
            </button>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
}
