import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { appBuckets, saveFiles, storage } from "src/storage";
import { db } from "@db/index";
import { eq } from "drizzle-orm";
import { filesTable } from "@db/schema";

const filesRoutes = new Hono()
    .post("/upload/:bucketName", zValidator("form", z.object({
        files: z.any(),
    })), async (_ctx) => {
        const parsedBody: {
            [x: string]: string | File | (string | File)[];
        } = await _ctx.req.parseBody({
            all: true,
        })
        const user = _ctx.get("user")!;
        const bucketName = _ctx.req.param("bucketName")

        if (!appBuckets.includes(bucketName)) {
            return _ctx.json({ error: "Invalid bucket" }, 400)
        }

        const _files = parsedBody["files"]

        if (!_files) {
            return _ctx.json({ error: "No files found" }, 400)
        }

        let files: File[] = []

        if (Array.isArray(_files)) {
            files = _files.filter((item): item is File => item instanceof File);
        } else {
            if (_files instanceof File) {
                files = [_files];
            }
        }

        if (bucketName === "avatars") {
            const result = await saveFiles(files, bucketName, user.id);

        }

        return _ctx.json({ success: true })

    })
    .get("/url/:bucketName/:key", async (_ctx) => {
        const { key, bucketName } = _ctx.req.param()
        const url = await storage.presignedGetObject(bucketName, key)
        return _ctx.json({ url })
    })
    .get("userFiles", async (_ctx) => {
        const user = _ctx.get("user")!;
        const files = await db.query.filesTable.findMany({
            where: eq(filesTable.userId, user.id),
        })
        return _ctx.json(files)
    })

export {
    filesRoutes,
}