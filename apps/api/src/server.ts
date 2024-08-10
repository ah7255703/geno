import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { socket } from './socket.js';
import { onConnect as RedisonStart } from './pubsub/index.js';
import { authRoutes } from './routes/auth.js';
import { jwtAuth } from "./auth/jwt"
import type { z } from 'zod';
import { env } from './env.js';
import { usersTable } from '@db/schema/user.js';
import { db } from '@db/index.js';
import { eq } from 'drizzle-orm';
import { userRoutes } from './routes/user.js';
import _ from 'lodash';
import { providerPrivateRoutes, providerPublicRoutes } from './routes/providers.js';
import { filesRoutes } from './routes/files.js';
import { initBuckets } from './storage/index.js';
import { articlesRoutes } from './routes/articles.js';

async function preStart() {
    RedisonStart();
    initBuckets();
}

declare module "hono" {
    interface ContextVariableMap {
        jwtPayload: z.infer<typeof jwtAuth.schema> | null;
        user: Omit<typeof usersTable.$inferSelect, 'password'> | null;
        sessionId: string | null;
    }
}

const publicApp = new Hono({
    strict: true,
}).basePath("/api");

publicApp.use(cors())
publicApp.use(logger())

publicApp.use(async (_ctx, next) => {
    const authHeader = _ctx.req.header("Authorization")
    const sessionId = _ctx.req.header("X-Session-Id")
    if (sessionId) {
        _ctx.set("sessionId", sessionId)
    }
    if (authHeader && authHeader.startsWith(jwtAuth.authorization)) {
        const token = authHeader.split(" ")[1].trim();
        if (token) {
            try {
                const payload = await jwtAuth.verify(token, env.JWT_SECRET)
                console.log(payload)
                _ctx.set("jwtPayload", payload)
            } catch (e) {
                _ctx.set("jwtPayload", null)
            }
        }
    }
    await next()
})

publicApp.use("/private/*", async (_ctx, next) => {
    const jwtPayload = _ctx.get("jwtPayload")
    if (!jwtPayload) {
        return _ctx.json({ error: "Unauthorized" }, 401)
    }
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, jwtPayload.userId),
        with: {
            avatar: true,
        }
    }).execute()
    if (!user) {
        return _ctx.json({ error: "Unauthorized" }, 401)
    }

    _ctx.set("user", _.omit(user, "password"))

    await next()
})

const privateApp = new Hono()
    .route('/user', userRoutes)
    .route("/providers", providerPrivateRoutes)
    .route("/files", filesRoutes)
    .route("/articles", articlesRoutes)

const allRoutes =
    publicApp.route("/auth", authRoutes)
        .route("/private", privateApp)
        .route("/providers", providerPublicRoutes)

const port = 3001
const server = serve({
    fetch: publicApp.fetch,
    port
}, (info) => {
    preStart()
})
console.log(`Server running at http://localhost:${port}`)
socket.listen(server)
export type BackendRoutes = typeof allRoutes