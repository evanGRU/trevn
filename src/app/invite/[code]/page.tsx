import {createSupabaseServerClient} from "@/utils/supabase/server";
import InvitePageClient from "@/app/invite/[code]/InviteClient";
import {notFound, redirect} from "next/navigation";

interface InvitePageProps {
    params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const paramsObject = await params;
    const invitationCode = paramsObject.code;

    if (!user) redirect(`/login?redirect=/invite/${invitationCode}`);

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("id, access_mode")
        .eq("invite_code", invitationCode)
        .maybeSingle();

    if (groupError) {
        console.error("Group fetch error:", groupError);
        notFound();
    }

    if (!group) {
        redirect("/groups?toast=invalid_invite");
    }

    if (group.access_mode === "closed") {
        redirect("/groups?toast=group_close");
    }

    const { data: membership, error: membershipError } = await supabase
        .from("groups_members")
        .select("id")
        .eq("group_id", group.id)
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) {
        console.error("Membership fetch error:", membershipError);
        notFound();
    }

    if (membership) {
        redirect(`/groups/${group.id}?toast=already_member`);
    }

    return <InvitePageClient/>;
}
