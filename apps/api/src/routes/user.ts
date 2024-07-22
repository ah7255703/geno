import { Hono } from "hono";

const userRoutes = new Hono()
    .get("/me", async (_ctx) => {
        return _ctx.json(_ctx.get("user"))
    })

export { userRoutes }