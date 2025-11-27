import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const sqliteFile = process.env.DB_FILE_NAME || "local.db";
const connection = new Database(sqliteFile);

export const db = drizzle(connection);


