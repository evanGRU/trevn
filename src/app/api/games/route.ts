import {createSupabaseServerClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

const steamLibraryImages = (appId: number) => [
    // Best quality first
    `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`,
];

async function getLibraryImage(appId: number) {
    for (const url of steamLibraryImages(appId)) {
        try {
            const r = await fetch(url, { method: "HEAD" });
            if (r.ok) return url;
        } catch {}
    }

    try {
        const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
        const json = await res.json();
        if (json[appId]?.data?.header_image) {
            return json[appId].data.header_image;
        }
    } catch {}
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
        .eq("group_id", groupId)
        .order('created_at', { ascending: false });

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

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();

    const {data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { groupId, gameId } = await req.json();

        if (!groupId || !gameId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const { error } = await supabase
            .from('groups_games')
            .insert({
                group_id: groupId,
                game_id: gameId,
                added_by: user.id,
            });

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'game_already_added' },
                    { status: 400 }
                );
            }

            return NextResponse.json({ error: 'Failed to add game' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
