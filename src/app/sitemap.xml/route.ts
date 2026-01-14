import { NextResponse } from "next/server";

export async function GET() {

    if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
        return new NextResponse(null, { status: 404 })
    }
    const urls = [
        "https://trevn.app/",
        "https://trevn.app/login",
        "https://trevn.app/register",
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
            .map(
                (url) => `
                  <url>
                    <loc>${url}</loc>
                    <priority>0.8</priority>
                  </url>`
                )
            .join("")}
      </urlset>`;

    return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}
