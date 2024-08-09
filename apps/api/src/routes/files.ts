import { Client } from "minio";
import { Hono } from "hono";
import { env } from "src/env";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@db/index";
import { usersTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { Readable } from "stream";

const storage = new Client({
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
    useSSL: false,
    endPoint: "localhost",
    port: 9000,
})

const buckets = [
    "files",
    "avatars",
    "projects",
    "etc"
] as const;

function initBuckets() {
    buckets.forEach(async (bucket) => {
        let exists = await storage.bucketExists(bucket)
        if (!exists) {
            await storage.makeBucket(bucket)
        }
    })
}

function fileToBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(Buffer.from(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function saveFiles(files: File[], bucketName: string) {
    return Promise.all(files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let url = await storage.putObject(bucketName, file.name, buffer, file.size)
        return url
    }))
}

const filesRoutes = new Hono()
    .post("/upload/:bucketName", zValidator("form", z.object({
        files: z.any(),
    })), async (_ctx) => {
        let parsedBody = await _ctx.req.parseBody({
            all: true,
        })
        const user = _ctx.get("user")!;
        let bucketName = _ctx.req.param("bucketName")

        if (!buckets.includes(bucketName as any)) {
            return _ctx.json({ error: "Invalid bucket" }, 400)
        }

        let _files = parsedBody["files"]

        if (!_files) {
            return _ctx.json({ error: "No files found" }, 400)
        }

        let files: File[] = []

        if (Array.isArray(_files)) {
            files = _files
        } else {
            files = [_files]
        }

        if (bucketName === "avatars") {
            let result = await saveFiles(files, bucketName);

        }

        return _ctx.json({ success: true })

    })

export {
    filesRoutes,
    initBuckets
}