import {createSupabaseServerClient} from "@/utils/supabase/server";

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
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
        return new Response(JSON.stringify({ error: "Missing groupId" }), { status: 400 });
    }

    const { data, error } = await supabase
        .from("groups_games_with_likes")
        .select(`
            id:game_id,
            name,
            likes_count,
            is_liked
        `)
        .eq("group_id", groupId);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const gamesWithImages = await Promise.all(
        (data ?? []).map(async (row) => {
            const imageUrl = await getLibraryImage(row.id);

            return {
                id: row.id,
                name: row.name,
                imageUrl,
                likes_count: row.likes_count,
                is_liked: row.is_liked
            };
        })
    );

    return Response.json(gamesWithImages);
}
