import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

const filesSchema = pgTable("files", {
    id: serial("id"),
    url: varchar("url", { length: 256 }).notNull(),
});