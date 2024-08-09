import { relations, sql } from "drizzle-orm";
import { AnyPgColumn, pgTable, primaryKey, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { filesTable, usersTable } from ".";

export const articlesTable = pgTable("articles", {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    title: varchar("title").notNull(),
    content: varchar("content").notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    userId: uuid("user_id").references((): AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
});

export const articleFilesTable = pgTable("article_files", {
    articleId: uuid("article_id").notNull().references((): AnyPgColumn => articlesTable.id, { onDelete: "cascade" }),
    fileId: varchar("file_id").notNull().references((): AnyPgColumn => filesTable.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        compositePk: primaryKey({ columns: [table.articleId, table.fileId] }),
    }
})

export const articlesRelations = relations(articlesTable, ({ many, one }) => ({
    user: one(usersTable),
    files: many(articleFilesTable),
}))
