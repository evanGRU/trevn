import { createClient } from '@/utils/supabase/server';
import SettingsClient from './SettingsClient';

export default async function Settings() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profileData } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user?.id)
        .single();

    return <SettingsClient initialProfile={profileData} initialUser={user} />;
}
