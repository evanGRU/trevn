import { NextResponse } from 'next/server'

export async function GET() {
    const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'

    const content = isProd ?
        (`
            User-agent: *
            Allow: /
        
            Sitemap: https://trevn.app/sitemap.xml
        `)
        : (`
            User-agent: *
            Disallow: /
        `)

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    })
}
