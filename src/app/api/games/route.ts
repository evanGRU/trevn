import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const steamLibraryImages = (appId: number) => [
    // Best quality first
    `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`,

    // Library hero
    `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_hero.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`,

    // Grid capsule 616x353
    `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/capsule_616x353.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`,

    // Header fallback
    `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`,
];

async function getLibraryImage(appId: number) {
    for (const url of steamLibraryImages(appId)) {
        try {
            const r = await fetch(url, { method: "HEAD" });
            if (r.ok) return url;
        } catch {}
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
        return new Response(JSON.stringify({ error: "Missing groupId" }), { status: 400 });
    }

    const { data, error } = await supabase
        .from("groups_games")
        .select(`
            game_id,
            steam_apps_min!inner(id, name)
        `)
        .eq("group_id", groupId);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const gamesWithImages = await Promise.all(
        (data ?? []).map(async (row) => {
            const game = row.steam_apps_min;
            const {name, id}: any = game;
            const image = await getLibraryImage(id);

            return {
                id: id,
                name: name,
                imageUrl: image,
            };
        })
    );

    return Response.json(gamesWithImages);
}
