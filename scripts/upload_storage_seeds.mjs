import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mime from "mime";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const color = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ROOT_FOLDER = path.resolve("./storage_seeds");
const BUCKET = "avatars";

function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            results = results.concat(getAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    });

    return results;
}

async function uploadStorageSeeds() {
    console.log(
        `\n${color.magenta}🚀 Début de l'upload du dossier storage_seeds...${color.reset}\n`
    );

    const files = getAllFiles(ROOT_FOLDER);

    for (const filePath of files) {
        const relativePath = path.relative(ROOT_FOLDER, filePath);
        const fileBuffer = fs.readFileSync(filePath);
        const contentType = mime.getType(filePath) || "application/octet-stream";

        console.log(
            `${color.blue}📤 Upload${color.reset} ${color.gray}${relativePath}${color.reset}`
        );

        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(relativePath, fileBuffer, {
                cacheControl: "3600",
                upsert: true,
                contentType,
            });

        if (error) {
            console.error(
                `${color.red}❌ Erreur :${color.reset} ${color.gray}${relativePath}${color.reset} — ${error.message}`
            );
        } else {
            console.log(
                `${color.green}✅ Succès :${color.reset} ${color.gray}${relativePath}${color.reset}`
            );
        }
    }

    console.log(
        `\n${color.magenta}🎉 Upload terminé avec succès !${color.reset}\n`
    );
}

uploadStorageSeeds();
