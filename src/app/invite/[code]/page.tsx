import {createSupabaseServerClient} from "@/utils/supabase/server";
import InvitePageClient from "@/app/invite/[code]/InviteClient";
import {redirect} from "next/navigation";

interface InvitePageProps {
    params: { code: string };
}

export default async function InvitePage({ params }: InvitePageProps) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const paramsObject = await params;
    const invitationCode = paramsObject.code;

    if (!user) redirect(`/login?redirect=/invite/${invitationCode}`);

    return <InvitePageClient/>;
}
