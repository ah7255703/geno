import { db } from "@db/index";
import { socialAccountsTable } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const providerRoutes = new Hono()
    .get("/", async (_ctx) => {
        let user = _ctx.get("user")!
        let providers = await db.query.socialAccountsTable.findMany({
            where: eq(socialAccountsTable.userId, user.id)
        }).execute();
        return _ctx.json(providers)
    })
    .get("/:id",zValidator("param", z.object({
        id: z.number()
    })) ,async (_ctx) => {
        let user = _ctx.get("user")!
        let params = _ctx.req.valid("param")
        let provider = await db.query.socialAccountsTable.findFirst({
            where: and(
                eq(socialAccountsTable.id, params.id),
                eq(socialAccountsTable.userId, user.id),
            )
        }).execute();
        return _ctx.json(provider)
    })
    .put("/:id",zValidator("param", z.object({
        id: z.number()
    })) ,async (_ctx) => {
        let user = _ctx.get("user")!
        let params = _ctx.req.valid("param");
        let provider = await db.query.socialAccountsTable.findFirst({
            where: and(
                eq(socialAccountsTable.id, params.id),
                eq(socialAccountsTable.userId, user.id),
            )
        }).execute();
        
        if (!provider) {
            return _ctx.json({ message: "Provider not found" }, 404);
        }
        
        return _ctx.json({})
    })
    .delete("/:id", async (_ctx) => {
        let user = _ctx.get("user")!
        return _ctx.json({})
    });



export {
    providerRoutes
}