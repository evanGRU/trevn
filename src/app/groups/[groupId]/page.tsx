import GroupDetailsClient from "@/app/groups/[groupId]/GroupDetailClient";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {notFound, redirect} from "next/navigation";

export default async function GroupsDetailPage({ params }: { params: { groupId: string } }) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const paramsObject = await params;
    const groupId = paramsObject.groupId;

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("id")
        .eq("id", groupId)
        .maybeSingle();

    if (groupError) {
        console.error("Group fetch error:", groupError);
        notFound();
    }

    if (!group) {
        redirect("/groups?toast=group_not_found");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select("id, username")
        .eq("id", user?.id)
        .single();

    return (
        <GroupDetailsClient profile={profile}/>
    );
}
