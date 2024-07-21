import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from './schema';
import { env } from "../env";

export const conn = new pg.Client({
    connectionString: env.PG_DB_URL,
});

(async () => {
    await conn.connect();
})();

export const db = drizzle(conn, {
    schema: schema,
    logger: true,
});