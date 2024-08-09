import { relations } from "drizzle-orm";
import { AnyPgColumn, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const filesTable = pgTable("files", {
    id: varchar("key").notNull().unique().primaryKey(),
    name: varchar("name").notNull(),
    size: varchar("size").notNull(),
    bucket: varchar("bucket").notNull(),
    userId: uuid("user_id").references((): AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
});

export const fileRelations = relations(filesTable, ({ many, one }) => ({
    user: one(usersTable),
}))
