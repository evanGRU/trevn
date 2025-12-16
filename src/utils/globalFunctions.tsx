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

export const getPublicAvatarUrl = (type: string | undefined, path: string | null | undefined ) => {
    const { data } = supabase.storage
        .from(`avatars/${type ?? ""}`)
        .getPublicUrl(path ?? "default00.jpg");

    return data.publicUrl;
};

export const smoothScroll = (el: HTMLElement, direction: "top" | "bottom", onComplete?: () => void, duration = 600) => {
    const start = el.scrollTop;
    const end = direction === "bottom" ? el.scrollHeight - el.clientHeight : 0;
    const change = end - start;
    const startTime = performance.now();

    function easeInOutCubic(t: number) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(time: number) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        el.scrollTop = start + change * eased;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete?.();
        }
    }

    requestAnimationFrame(animate);
};
