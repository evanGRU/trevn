import { NextResponse } from "next/server";

export async function GET() {
    const urls = [
        "https://trevn.app/",
        "https://trevn.app/groups",
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
