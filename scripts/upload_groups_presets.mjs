import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const folder = path.resolve('./storage_seeds/groups');
const bucket = 'avatars/groups';

async function uploadDefaultImages() {
    const files = fs.readdirSync(folder);

    for (const file of files) {
        const filePath = path.join(folder, file);
        const fileBuffer = fs.readFileSync(filePath);
        const contentType = mime.getType(filePath) || 'application/octet-stream';

        const { error } = await supabase.storage
            .from(bucket)
            .upload(file, fileBuffer, { upsert: true, contentType });

        if (error) console.error(`Erreur upload ${file}:`, error.message);
        else console.log(`✅ ${file} uploadé avec succès`);
    }
}

uploadDefaultImages();
