import GroupDetailsClient from "@/app/groups/[groupId]/GroupDetailClient";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export default async function GroupsDetailPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select("id, username")
        .eq("id", user?.id)
        .single();

    return (
        <GroupDetailsClient profile={profile}/>
    );
}
