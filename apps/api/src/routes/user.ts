import { db } from "@db/index";
import { usersTable } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { saveFiles } from "src/storage";
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

    .post("/settings/profile/avatar", zValidator("form", z.object({
        avatarFile: z.custom<File>((data) => {
            if (data instanceof File) {
                return true
            }
            return false
        }),
    })), async (_ctx) => {
        let user = _ctx.get("user")!
        let parsedBody = await _ctx.req.parseBody({
            all: true,
        })
        let avatarFile = parsedBody["avatarFile"] as File
        let result = await saveFiles([avatarFile], "avatars", user.id);
        await db.update(usersTable).set({
            imageFileId: result[0].id
        }).where(
            eq(usersTable.id, user.id)
        ).execute()

        return _ctx.json({ success: true, file: result[0] })
    })

export { userRoutes }