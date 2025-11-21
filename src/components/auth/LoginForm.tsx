"use client";

import {useState} from "react";
import { createClient } from "@/utils/supabase/client";
import {useRouter} from "next/navigation";

export default function LoginForm() {
    const supabase = createClient();
    const router = useRouter();

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email: loginForm.email,
            password: loginForm.password,
        });

        setLoginForm({
            email: "",
            password: ""
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            router.push("/home");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                    setLoginForm({
                        ...loginForm,
                        email: e.target.value,
                    })
                }
                required
            />

            <input
                type="password"
                placeholder="Mot de passe"
                value={loginForm.password}
                onChange={(e) =>
                    setLoginForm({
                        ...loginForm,
                        password: e.target.value,
                    })
                }
                required
            />

            <button type="submit">Connexion</button>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
}
