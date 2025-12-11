import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GroupsLayoutClient from "@/app/groups/GroupLayoutClient";

export default async function GroupsPageLayout({children}: {children: React.ReactNode}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", user.id)
        .single();

    return (
        <GroupsLayoutClient profile={profile}>
            {children}
        </GroupsLayoutClient>
    );
}
