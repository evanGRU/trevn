import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const STEAM_KEY = process.env.STEAM_KEY;
const MAX_RESULTS = 50000;
const DELAY_MS = 500;
const wait = ms => new Promise(r => setTimeout(r, ms));

async function getLastAppid() {
    const { data } = await supabase
        .from('steam_sync_state')
        .select('last_appid')
        .eq('id', 'progress')
        .single();

    return data?.last_appid || 0;
}

async function setLastAppid(appid) {
    const { error } = await supabase
        .from('steam_sync_state')
        .upsert({
            id: 'progress',
            last_appid: appid,
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error("Error saving last_appid:", error)
    }
}

async function fetchApps(lastAppid) {
    const url = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${STEAM_KEY}&max_results=${MAX_RESULTS}&last_appid=${lastAppid}`;
    const res = await fetch(url);
    const json = await res.json();
    return json?.response?.apps || [];
}

async function upsertApps(apps) {
    if (!apps.length) return;
    const rows = apps.map(a => ({
        id: a.appid,
        name: a.name,
        last_modified: a.last_modified,
    }));

    const { error } = await supabase.from('steam_apps_min').upsert(rows);
    if (error) {
        console.error("Upsert error:", error)
    } else {
        console.log(`Inserted ${rows.length} apps`)
    }
}

(async () => {
    try {
        let lastAppid = await getLastAppid();
        console.log("Resuming from last_appid:", lastAppid);

        while (true) {
            const apps = await fetchApps(lastAppid);
            if (!apps.length) break;

            console.log(`Fetched ${apps.length} apps from Steam starting at ${lastAppid}`);
            await upsertApps(apps);

            lastAppid = apps[apps.length - 1].appid;
            await setLastAppid(lastAppid);

            console.log(`Progress saved, last_appid = ${lastAppid}. Waiting ${DELAY_MS}ms before next batch`);
            await wait(DELAY_MS);
        }

        console.log("All Steam apps fetched and inserted into steam_apps_min!");
    } catch (err) {
        console.error("Fatal error:", err);
    }
})();
