import { pgEnum, pgTable, serial, timestamp, uuid, text, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";
import { GithubUser } from "src/providers/types/github";
import { TelegraphAccount } from "src/providers/Telegraph";

export const supportedProviders = [
    "linkedin",
    "github",
    "twitter",
    "facebook",
    "telegraph"
] as const;

export const supportedProvidersEnum = pgEnum("supported_providers", supportedProviders)

export const socialAccountsTable = pgTable('social_accounts', {
    id: serial('id'),
    userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    providerUserId: text("provider_account_id").notNull(),
    tokenExpiry: timestamp("token_expiry"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    provider: supportedProvidersEnum("provider").notNull(),
    accountData: jsonb("account_data").$type<GithubUser | TelegraphAccount | null>().default(null),
}, (table) => ({
    pk: primaryKey({ columns: [table.id, table.provider, table.providerUserId] }),
}));

export const socialAccountsRelations = relations(socialAccountsTable, ({ one, many }) => ({
    user: one(usersTable),
}))