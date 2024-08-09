import z from "zod";

const envSchama = z.object({
    PG_DB_URL: z.string().url(),
    JWT_SECRET: z.string(),
    JWT_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string(),
    REDIS_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    MINIO_ACCESS_KEY: z.string(),
    MINIO_SECRET_KEY: z.string(),
    MINIO_ENDPOINT: z.string().url(),
});

export const env = envSchama.parse(process.env);