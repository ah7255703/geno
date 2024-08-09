import { Hono } from "hono";
import { db } from "@db/index";
import { articlesTable } from "@db/schema";
import { eq } from "drizzle-orm";

const articlesRoutes = new Hono()
    .get("/", async (_ctx) => {
        let user = _ctx.get("user")!;
        let articles = await db.query.articlesTable.findMany({ where: eq(articlesTable.userId, user.id) }).execute();
        return _ctx.json(articles)
    })

export { articlesRoutes }