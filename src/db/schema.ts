import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const experiments = sqliteTable("experiments", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at").notNull(),
    mode: text("mode").notNull(),
    inputText: text("input_text").notNull(),
    outputText: text("output_text").notNull(),
    label: text("label"),
});