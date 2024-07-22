import { pgTable, primaryKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const blackListedRefreshTokens = pgTable('black_listed_refresh_tokens', {
    id: serial('id'),
    token: varchar('token', { length: 256 }).notNull().unique(),
}, (table) => {
    return {
        compositePk: primaryKey({ columns: [table.token, table.id] }),
    }
})