import { pgTable, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const socialAccountsTable = pgTable('social_accounts', {
    id: serial('id'),
    userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    provider: uuid("provider").notNull(),
    providerUserId: uuid("provider_account_id").notNull(),
    tokenExpiry: timestamp("token_expiry").notNull(),
    accessToken: uuid("access_token").notNull(),
    refreshToken: uuid("refresh_token"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export const socialAccountsRelations = relations(socialAccountsTable, ({one,many})=>({
    user: one(usersTable),
}))