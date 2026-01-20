import type {Metadata} from "next";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Invitation - Trevn",
    description: "tu as été invité à rejoindre un groupe sur Trevn.",
    robots: {
        index: false,
        follow: false,
    },
}

interface InvitePageProps {
    params: Promise<{ code: string }>;
}

export default async function InviteCodePage({ params }: InvitePageProps) {
    const paramsObject = await params;
    const invitationCode = paramsObject.code;

    redirect(`/invite/${invitationCode}`);
}