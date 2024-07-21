import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, serial, varchar, timestamp, boolean, uuid, text, primaryKey, integer, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const accountsTable = pgTable('account', {
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    provider: varchar('provider', { length: 256 }).notNull(),
    providerAccountId: varchar('provider_account_id', { length: 256 }).notNull(),
    refreshToken: varchar('refresh_token', { length: 256 }),
    accessToken: varchar('access_token', { length: 256 }),
    expiresAt: timestamp('expires_at', { mode: "date" }),
    tokenType: varchar('token_type', { length: 256 }),
    scope: varchar('scope', { length: 256 }),
    idToken: varchar('id_token', { length: 256 }),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
}, (table) => {
    return {
        compositePk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    }
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

export const sessionsTable = pgTable('session', {
    sessionToken: varchar('session_token', { length: 256 }).notNull().primaryKey(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp('expires_at', { mode: "date" }).notNull(),
});

export const authenticatorTable = pgTable('authenticator', {
    credentialID: varchar('credential_id', { length: 256 }).notNull().primaryKey(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    providerAccountId: varchar('provider_account_id', { length: 256 }).notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: varchar('credential_device_type', { length: 256 }),
    credentialBackedUp: boolean('credential_backed_up').notNull().default(false),
    transports: text('transports'),
})

export const accountsTableRelations = relations(accountsTable, ({ one, many }) => ({
    user: one(usersTable),
}));

export const authenticatorTableRelations = relations(authenticatorTable, ({ one, many }) => ({
    user: one(usersTable),
}));

export const verificationTokenRelations = relations(VerificationToken, ({ one, many }) => ({
    user: one(usersTable),
}));

export const sessionsTableRelations = relations(sessionsTable, ({ one, many }) => ({
    user: one(usersTable),
}));

export const userRelations = relations(usersTable, ({ one, many }) => ({
    accounts: many(accountsTable),
    authenticator: many(sessionsTable),
    sessions: many(sessionsTable),
    verificationTokens: many(VerificationToken),
    authenticators: many(authenticatorTable),
}));