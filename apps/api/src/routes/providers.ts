import { db } from "@db/index";
import { socialAccountsTable, supportedProviders } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { GitHub, OAuth2RequestError } from "arctic";
import { env } from "src/env";
import bcrypt from "bcrypt";
import type { GithubUser } from "src/providers/types/github";
import { Telegraph } from "src/providers/Telegraph";


const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {
    redirectURI: "http://localhost:3001/api/providers/callback/github"
})

const telegraph = new Telegraph();

// http://localhost:3001/api/providers/callback/github



const providerPrivateRoutes = new Hono()
    .get("/", async (_ctx) => {
        const user = _ctx.get("user")!
        const providers = await db.query.socialAccountsTable.findMany({
            where: eq(socialAccountsTable.userId, user.id)
        }).execute();
        return _ctx.json(providers)
    }).get("/available_to_add", async (_ctx) => {
        const user = _ctx.get("user")!;

        const providers = await db.query.socialAccountsTable.findMany({
            where: and(
                eq(socialAccountsTable.userId, user.id),
            ),
        }).execute();

        const availableProviders = supportedProviders.map(provider => ({
            provider,
            available: !providers.some(p => p.provider === provider)
        }))

        return _ctx.json(availableProviders)
    })
    .get("/:id", zValidator("param", z.object({
        id: z.number()
    })), async (_ctx) => {
        const user = _ctx.get("user")!
        const params = _ctx.req.valid("param")
        const provider = await db.query.socialAccountsTable.findFirst({
            where: and(
                eq(socialAccountsTable.id, params.id),
                eq(socialAccountsTable.userId, user.id),
            )
        }).execute();
        return _ctx.json(provider)
    })
    .put("/:id", zValidator("param", z.object({
        id: z.number()
    })), async (_ctx) => {
        const user = _ctx.get("user")!
        const params = _ctx.req.valid("param");
        const provider = await db.query.socialAccountsTable.findFirst({
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
        const user = _ctx.get("user")!
        const id = _ctx.req.param("id");
        const provider = await db.delete(socialAccountsTable).where(and(
            eq(socialAccountsTable.id, Number.parseInt(id)),
            eq(socialAccountsTable.userId, user.id),
        )).returning().execute();
        return _ctx.json(provider)
    })
    .post("/link/telegraph", zValidator("json", z.object({
        short_name: z.string(),
        author_name: z.string(),
        author_url: z.string().optional()
    })), async (_ctx) => {
        const user = _ctx.get("user")!;
        const params = _ctx.req.valid("json");
        const account = await telegraph.createAccount({
            short_name: params.short_name,
            author_name: params.author_name,
            author_url: params.author_url
        });

        if (!account.ok) {
            return _ctx.json({ error: "Failed to create account" }, 500)
        }
        const savedData = await db.insert(socialAccountsTable).values({
            accessToken: account.result.access_token,
            provider: "telegraph",
            providerUserId: account.result.short_name,
            userId: user.id,
            accountData: account.result,
        }).returning().execute();

        if (!savedData.at(0)) {
            return _ctx.json({ error: "Failed to save account data" }, 500)
        }

        return _ctx.json(savedData.at(0))
    })
    .post("/link/:providerId",
        zValidator("json", z.object({
            redirectUrl: z.string().optional()
        }))
        , async (_ctx) => {
            const params = _ctx.req.valid("json");
            const user = _ctx.get("user")!;
            const providerId = _ctx.req.param("providerId");
            const state = {
                userId: user.id,
                redirectUrl: params.redirectUrl
            }
            if (providerId === "github") {
                const link = await github.createAuthorizationURL(decodeURIComponent(JSON.stringify(state)), {
                    scopes: ["user:email"]
                });
                return _ctx.json({
                    provider: "github",
                    link
                })
            };
            return _ctx.json({ message: "Provider not found" }, 404);
        })
    .get("/unlink/:providerId", async (_ctx) => {
        const user = _ctx.get("user")!;
        const providerId = _ctx.req.param("providerId") as any;
        const provider = await db.query.socialAccountsTable.findFirst({
            where: and(
                eq(socialAccountsTable.userId, user.id),
                eq(socialAccountsTable.provider, providerId)
            )
        }).execute();
        if (!provider) {
            return _ctx.json({ message: "Provider not found" }, 404);
        }
        await db.delete(socialAccountsTable).where(eq(socialAccountsTable.id, provider.id)).execute();
        return _ctx.json({})
    })


const providerPublicRoutes = new Hono()
    .get("/callback/github", zValidator("query", z.object({
        state: z.string(),
        code: z.string()
    })), async (_ctx) => {
        const params = _ctx.req.valid("query");
        const state = JSON.parse(decodeURIComponent(params.state)) as { userId: string, redirectUrl: string };
        try {
            const githubTokens = await github.validateAuthorizationCode(params.code);
            const token = await bcrypt.hash(githubTokens.accessToken, 10);
            const githubAccountRequest = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${githubTokens.accessToken}`
                }
            })
            const githubAccount = await githubAccountRequest.json() as GithubUser
            const savedData = await db.insert(socialAccountsTable).values({
                accessToken: token,
                provider: "github",
                providerUserId: githubAccount.id.toString(),
                userId: state.userId,
                accountData: githubAccount,
            }).returning().execute();
            if (!savedData) {
                return _ctx.json({ error: "Failed to save account data" }, 500)
            }
            return _ctx.redirect(state.redirectUrl)
        } catch (error) {
            if (error instanceof OAuth2RequestError) {
                return _ctx.json({ error: error.message }, 500)
            }
            throw error;
        }

    })

export {
    providerPrivateRoutes,
    providerPublicRoutes
}