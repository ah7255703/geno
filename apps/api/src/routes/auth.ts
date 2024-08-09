import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import { compare, hash } from 'bcrypt'
import { db } from "@db/index";
import { and, eq } from "drizzle-orm";
import { blackListedRefreshTokens, usersTable } from "@db/schema";
import _ from "lodash";
import jwt from "jsonwebtoken";
import { env } from "src/env";
import { jwtAuth } from "src/auth/jwt";

const rounds = 10

export const authRoutes = new Hono()
    .post("/email-password/register", zValidator("json", z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
    })), async (_ctx) => {
        let data = _ctx.req.valid("json")
        let doesExist = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, data.email)
        }).execute();
        if (doesExist) {
            return _ctx.json({ error: "Email already exists" }, 400)
        }
        let hashedPassword = await hash(data.password, rounds)

        let user = await db.insert(usersTable).values({
            email: data.email,
            password: hashedPassword,
            name: data.name
        }).returning().
            execute();

        return _ctx.json(_.omit(user.at(0), ["password"]))
    })

    .post("/email-password/login", zValidator("json", z.object({
        email: z.string().email(),
        password: z.string().min(8),
    })), async (_ctx) => {
        let data = _ctx.req.valid("json")
        let user = await db.query.usersTable.findFirst({
            where: and(
                eq(usersTable.email, data.email),
            )
        }).execute();
        if (!user || !user.password) {
            return _ctx.json({ error: "User not found" }, 404)
        }
        let passwordMatch = await compare(data.password, user.password)
        if (!passwordMatch) {
            return _ctx.json({ error: "Incorrect password" }, 401)
        }

        let accessToken = jwtAuth.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_TOKEN_EXPIRY });
        let refreshToken = jwtAuth.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRY });

        return _ctx.json({ accessToken, refreshToken })
    })
    .post("/jwt/refresh", zValidator("json", z.object({
        refreshToken: z.string()
    })), async (_ctx) => {
        let data = _ctx.req.valid("json")

        let blackListed = await db.query.blackListedRefreshTokens.findFirst({
            where: eq(blackListedRefreshTokens.token, data.refreshToken)
        }).execute();

        if (blackListed) {
            return _ctx.json({ error: "Token is blacklisted" }, 401)
        }

        let decoded = jwtAuth.verify(data.refreshToken, env.JWT_SECRET)

        let user = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, decoded.userId)
        }).execute();

        if (!user) {
            return _ctx.json({ error: "User not found" }, 404)
        }

        db.insert(blackListedRefreshTokens).values({
            token: data.refreshToken,
        }).execute()

        let accessToken = jwtAuth.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "1d" });
        let refreshToken = jwtAuth.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });

        return _ctx.json({ accessToken, refreshToken })
    })