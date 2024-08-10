import { Hono } from "hono";
import { db } from "@db/index";
import { articleFilesTable, articlesTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { saveFiles } from "src/storage";

const articlesRoutes = new Hono()
    .get("/", async (_ctx) => {
        let user = _ctx.get("user")!;
        let articles = await db.query.articlesTable.findMany({ where: eq(articlesTable.userId, user.id) }).execute();
        return _ctx.json(articles)
    })
    .post("/", zValidator("json", z.object({
        title: z.string(),
        tags: z.array(z.string()),
        content: z.string(),
        images: z.array(z.custom<File>(f => f instanceof File)),
    })), async (_ctx) => {
        const user = _ctx.get("user")!;
        const data = _ctx.req.valid("json");
        let result = await db.transaction(async (trx) => {
            let article = (await trx.insert(articlesTable).values({
                content: data.content,
                tags: data.tags,
                title: data.title,
                userId: user.id,
            }).returning().execute()).at(0);
            if (!article) {
                trx.rollback();
                return;
            }

            let images = await saveFiles(data.images, "projects", user.id);
            let imagesDb = trx.insert(articleFilesTable).values(images.map((image) => ({
                articleId: article.id,
                fileId: image.id,
            }))).execute();
            return {
                article,
                imagesDb,
            }
        })
        return _ctx.json(result);
    })

export { articlesRoutes }