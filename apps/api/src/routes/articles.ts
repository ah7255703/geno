import { Hono } from "hono";
import { db } from "@db/index";
import { articleFilesTable, articlesTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { saveFiles } from "src/storage";

const articlesRoutes = new Hono()
    .get("/", async (_ctx) => {
        const user = _ctx.get("user")!;
        const articles = await db.query.articlesTable.findMany({ where: eq(articlesTable.userId, user.id) });
        return _ctx.json(articles)
    })
    .post("/", zValidator("json", z.object({
        title: z.string(),
        tags: z.array(z.string()),
        content: z.any(),
    })), async (_ctx) => {
        const user = _ctx.get("user")!;
        const data = _ctx.req.valid("json");
        const result = await db.transaction(async (trx) => {
            const article = (await trx.insert(articlesTable).values({
                content: data.content,
                tags: data.tags,
                title: data.title,
                userId: user.id,
            }).returning().execute()).at(0);
            if (!article) {
                trx.rollback();
                return;
            }
            return {
                article,
            }
        })
        return _ctx.json(result);
    })

export { articlesRoutes }