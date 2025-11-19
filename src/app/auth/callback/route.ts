import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const origin = url.origin
    const code = url.searchParams.get('code')
    let next = url.searchParams.get('next') ?? '/home'

    if (!next.startsWith('/')) next = '/home'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
