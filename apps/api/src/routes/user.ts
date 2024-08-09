import { db } from "@db/index";
import { usersTable } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const userRoutes = new Hono()
    .get("/me", async (_ctx) => {
        return _ctx.json(_ctx.get("user"))
    })
    .post("/settings", zValidator("json", z.object({
        theme: z.enum(["light", "dark", "system"]).optional(),
    })), async (_ctx) => {
        let user = _ctx.get("user")!
        let json = await _ctx.req.valid("json")
        let resp = await db.update(usersTable).set({
            theme: json.theme
        })
            .where(
                eq(usersTable.id, user.id)
            )
            .execute()
        return _ctx.json({ success: true })
    })

    .post("/settings/profile", zValidator("json", z.object({})), async (_ctx) => {})

export { userRoutes }