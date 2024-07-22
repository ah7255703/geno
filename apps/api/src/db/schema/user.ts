import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, serial, varchar, timestamp, boolean, uuid, text, primaryKey, integer, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { socialAccountsTable } from './socialAccounts';

export const userRole = pgEnum("user_role", [
    "admin",
    "user",
]);

export const theme = pgEnum("theme", [
    "light",
    "dark",
    "system"
]);

export const creationMethod = pgEnum("creation_method", [
    "email-password",
    "social",
    "email-only",
]);

export const usersTable = pgTable('user', {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    role: userRole('role').notNull().default("user"),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    password: varchar('password', { length: 256 }),
    creationMethod: creationMethod('creation_method').notNull().default("email-password"),
    emailVerifiedAt: timestamp('verified_email_at'),
    emailVerified: boolean('verified_email').notNull().default(false),
    image: varchar('image_url', { length: 256 }),
    theme: theme('theme').notNull().default("system"),
});

export const VerificationToken = pgTable('verification_token', {
    id: serial('id'),
    token: varchar('token', { length: 256 }).notNull().unique(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp('expires_at', { mode: "date" }).notNull(),
}, (table) => {
    return {
        compositePk: primaryKey({ columns: [table.token, table.id] }),
    }
})

export const verificationTokenRelations = relations(VerificationToken, ({ one, many }) => ({
    user: one(usersTable),
}));


export const userRelations = relations(usersTable, ({ one, many }) => ({
    verificationTokens: many(VerificationToken),
    socialAccounts: many(socialAccountsTable)
}));