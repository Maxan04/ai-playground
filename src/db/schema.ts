import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const experiments = sqliteTable("experiments", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    mode: text("mode").notNull(),
    inputText: text("input_text").notNull(),
    outputText: text("output_text").notNull(),
    label: text("label"),
});