
import type {Metadata} from "next";
import React from "react";
import MaintenanceMobilePageClient from "@/app/maintenance/mobile/MaintenanceMobileClient";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Version mobile bientôt disponible",
    robots: {
        index: false,
        follow: false,
    },
}

export default async function MaintenanceMobilePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    return <MaintenanceMobilePageClient></MaintenanceMobilePageClient>;
}
