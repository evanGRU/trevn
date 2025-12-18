import {createClient} from "@/utils/supabase/client";
import {useToasts} from "@/utils/useToasts";
const supabase = createClient();

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const isEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
}

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

export const fetcher = async (url: string, errorMessage: string) => {
    const {errorToast} = useToasts();

    const res = await fetch(url)
    if (!res.ok) {
        errorToast(errorMessage);
        return;
    }
    return res.json();
}