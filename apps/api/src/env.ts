import z from "zod";

const envSchama = z.object({
    PG_DB_URL: z.string().url(),
    JWT_SECRET: z.string(),
    JWT_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string(),
    REDIS_URL: z.string().url(),
});

export const env = envSchama.parse(process.env);