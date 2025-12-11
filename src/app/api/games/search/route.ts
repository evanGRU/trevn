import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const normalizeString = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const cdnUrls = (appId: number) => [
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_231x87.jpg`,
    `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/capsule_231x87.jpg`,
    `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_231x87.jpg`,
    `https://media.steampowered.com/steam/apps/${appId}/capsule_231x87.jpg`,
];

async function getValidImage(appId: number) {
    for (const url of cdnUrls(appId)) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            if (res.ok) return url;
        } catch {}
    }

    try {
        const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
        const json = await res.json();
        if (json[appId]?.data?.header_image) {
            return json[appId].data.header_image;
        }
    } catch {}

    return "/game_placeholder.jpg";
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("q")?.trim() ?? "";

    if (!rawQuery) return Response.json([]);
    const normalizedQuery = normalizeString(rawQuery);

    const { data, error } = await supabase
        .from("steam_apps_min")
        .select("id, name")
        .or(`search_name.ilike.%${normalizedQuery}%`)
        .limit(10);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const gamesWithImages = await Promise.all(
        (data ?? []).map(async (game) => {
            const imageUrl = await getValidImage(game.id);
            return { ...game, imageUrl };
        })
    );

    const sorted = gamesWithImages.sort((a, b) => {
        const aName = normalizeString(a.name);
        const bName = normalizeString(b.name);

        const aScore = aName.startsWith(normalizedQuery) ? 3 : aName.includes(normalizedQuery) ? 2 : 1;
        const bScore = bName.startsWith(normalizedQuery) ? 3 : bName.includes(normalizedQuery) ? 2 : 1;

        return bScore - aScore;
    });

    return Response.json(sorted);
}
