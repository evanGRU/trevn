import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GroupsLayoutClient from "@/app/groups/GroupLayoutClient";
import type {Metadata} from "next";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default async function GroupsPageLayout({children}: {children: React.ReactNode}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    return (
        <GroupsLayoutClient>
            {children}
        </GroupsLayoutClient>
    );
}
