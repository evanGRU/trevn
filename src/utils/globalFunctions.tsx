import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const isEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
}

export const doesEmailExist = async (email: string) => {
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

export const getPublicAvatarUrl = (path: string | null | undefined) => {
    if (!path) return "/defaultPP.jpg";

    const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

    return data.publicUrl;
};