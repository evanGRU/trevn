import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import JoinGroupClient from './JoinGroupClient'

export default async function Home() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

    return <JoinGroupClient profile={profile} user={user}/>
}
