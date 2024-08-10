import { Client } from "minio";
import { env } from "src/env";
import { db } from "@db/index";
import { filesTable } from "@db/schema";

export const appBuckets = [
    "avatars",
    "projects",
    "etc"
] as const;


export function initBuckets() {
    for (let i = 0; i < appBuckets.length; i++) {
        const bucket = appBuckets[i];
        (async () => {
            const exists = await storage.bucketExists(bucket);
            if (!exists) {
                await storage.makeBucket(bucket);
            }
        })();
    }
}


export const storage = new Client({
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
    useSSL: false,
    endPoint: "localhost",
    port: 9000,
})


export async function saveFiles(files: File[], bucketName: typeof appBuckets[number], userId?: string) {

    const uploadedFilesMeta = await Promise.all(files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileMeta = {
            key: `${Date.now()}-${file.name}`,
            originalName: file.name,
            size: file.size,
            'Content-Type': file.type,
        }
        const mdata = await storage.putObject(bucketName, fileMeta.key, buffer, file.size, fileMeta)
        return {
            fileMeta
        }
    }))

    const query = await db.insert(filesTable).values(uploadedFilesMeta.map((f) => ({
        id: f.fileMeta.key,
        bucket: bucketName,
        userId: userId,
        name: f.fileMeta.originalName,
        size: f.fileMeta.size.toString(),
    }))).returning().execute()

    return query
}