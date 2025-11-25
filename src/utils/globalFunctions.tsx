import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const getPublicAvatarUrl = (path: string | null | undefined) => {
    if (!path) return "/defaultPP.jpg";

    const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

    return data.publicUrl;
};