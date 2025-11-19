"use client"

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from "@supabase/supabase-js";

export default function HomeClient({ user }: { user: User }) {
    const supabase = createClient()
    const router = useRouter()

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div>
            <h2>Bienvenue {user.email}!</h2>
            <button onClick={logout}>Se déconnecter</button>
        </div>
    )
}
