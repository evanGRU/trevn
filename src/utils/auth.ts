import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

export const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login';
}