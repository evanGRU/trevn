import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GroupPageClient from './GroupPageClient'

export default async function GroupsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log(user);

    if (!user) {
        console.log('redirect');
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", user.id)
        .single();

    return <GroupPageClient profile={profile}/>
}
