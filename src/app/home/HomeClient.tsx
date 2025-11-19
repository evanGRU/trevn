"use client"

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

export default function HomeClient({ user }: { user: User }) {
    const supabase = createClient()
    const router = useRouter()

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    console.log(user);

    return (
        <div>
            <p>Bienvenue {user.email}!</p>
            <Image
                src={user.user_metadata.picture}
                alt={"Photo de profil Google"}
                width={100}
                height={100}
            />
            <button onClick={logout}>Se déconnecter</button>
        </div>
    )
}
