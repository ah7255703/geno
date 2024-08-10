import { relations, sql } from "drizzle-orm";
import { type AnyPgColumn, boolean, jsonb, pgTable, primaryKey, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { supportedProvidersEnum } from "./socialAccounts";
import { usersTable } from "./user";
import { filesTable } from "./files";

export const articlesTable = pgTable("articles", {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    title: varchar("title").notNull(),
    content: jsonb("content").default({}).notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    userId: uuid("user_id").references((): AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
    tags: jsonb("tags").notNull().default([]).$type<string[]>(),
})

export const articlePublishTable = pgTable("article_publish", {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    articleId: uuid("article_id").notNull().references((): AnyPgColumn => articlesTable.id, { onDelete: "cascade" }),
    publishedAt: timestamp("published_at").notNull().default(sql`now()`),
    published: boolean("published").notNull().default(false),
    publishedUrl: varchar("published_url").notNull(),
    publishedProvider: supportedProvidersEnum("published_provider").notNull(),
    publishedProviderId: varchar("published_provider_id").notNull(),
    publishedProviderData: jsonb("published_provider_data").notNull(),
})

export const articleFilesTable = pgTable("article_files", {
    articleId: uuid("article_id").notNull().references((): AnyPgColumn => articlesTable.id, { onDelete: "cascade" }),
    fileId: varchar("file_id").notNull().references((): AnyPgColumn => filesTable.id, { onDelete: "cascade" }),
    showOrder: serial("show_order").notNull(),
    visible: boolean("visible").notNull().default(true),
}, (table) => {
    return {
        compositePk: primaryKey({ columns: [table.articleId, table.fileId] }),
    }
})

export const articlesRelations = relations(articlesTable, ({ many, one }) => ({
    user: one(usersTable),
    files: many(articleFilesTable),
    publish: many(articlePublishTable),
}))


export const articlePublishRelations = relations(articlePublishTable, ({ one }) => ({
    article: one(articlesTable),
}))