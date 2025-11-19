"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginButtons() {
    const supabase = createClient();

    const handleOAuthLogin = async (provider: "google" | "discord") => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/home`,
            },
        });

        if (error) {
            console.error("OAuth login error:", error.message);
        }
    };

    return (
        <div>
            <button onClick={() => handleOAuthLogin("google")}>
                Se connnecter avec Google
            </button>

            <button onClick={() => handleOAuthLogin("discord")}>
                Se connecter avec Discord
            </button>
        </div>
    );
}
