import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqliteFile = "./data/local.db";
const connection = new Database(sqliteFile);

export const db = drizzle(connection);


