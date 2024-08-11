import { Hono } from "hono";
import { db } from "@db/index";
import { articleFilesTable, articlesTable } from "@db/schema";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { saveFiles } from "src/storage";

const articleValidation = z.object({
    title: z.string(),
    tags: z.array(z.string()),
    content: z.any(),
})

const articlesRoutes = new Hono()
    .post("/", zValidator("json", articleValidation), async (_ctx) => {
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
    .get("/", async (_ctx) => {
        const user = _ctx.get("user")!;
        const articles = await db.query.articlesTable.findMany({ where: eq(articlesTable.userId, user.id) });
        return _ctx.json({ articles })
    })
    .get("/:articleId", async (_ctx) => {
        const user = _ctx.get("user")!;
        const articleId = _ctx.req.param("articleId");
        const article = await db.query.articlesTable.findFirst({
            where: and(
                eq(articlesTable.id, articleId),
                eq(articlesTable.userId, user.id),
            )
        });
        if (!article || article.userId !== user.id) {
            return _ctx.json({ message: "Article not found" }, 404);
        }
        return _ctx.json({ article });
    })
    .patch("/:articleId", zValidator("json", articleValidation), async (_ctx) => {
        const user = _ctx.get("user")!;
        const articleId = _ctx.req.param("articleId");
        const data = _ctx.req.valid("json");
        const result = await db.transaction(async (trx) => {
            const article = (await trx.update(articlesTable).set({
                content: data.content,
                tags: data.tags,
                title: data.title,
            }).where(
                and(
                    eq(articlesTable.id, articleId),
                    eq(articlesTable.userId, user.id),
                )
            ).returning().execute()).at(0);
            if (!article) {
                trx.rollback();
                return;
            }
            return {
                article,
            }
        })

        return _ctx.json({ result });
    })
export { articlesRoutes }