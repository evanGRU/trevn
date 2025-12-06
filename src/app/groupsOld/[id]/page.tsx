import { createClient } from "@/utils/supabase/server";
import GroupClient from "./GroupClient";

export default async function GroupPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user?.id)
        .maybeSingle();

    if (groupError) {
        return <div>Erreur : {groupError.message}</div>;
    }

    if (!group) {
        return <div>Groupe introuvable</div>;
    }

    return <GroupClient profile={profile} group={group} />;
}
