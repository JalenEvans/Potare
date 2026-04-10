import * as SQLite from "expo-sqlite";
import type { BarCreate } from "@/types/bar";
import * as BarServices from "./bar_services";
import { bars_data } from "./mock_data";

export const db = SQLite.openDatabaseSync("potare.db");

export const initDatabase = async () => {
  try {
    await db.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS bar (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                address TEXT UNIQUE NOT NULL,
                coords TEXT UNIQUE NOT NULL CHECK (json_valid(coords))
            );

            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE CHECK (email LIKE '%_@_%._%'),
                hashedPassword TEXT NOT NULL
                stats TEXT CHECK (json_valid(stats))
            );
        `);

    BarServices.set_db(db);
    bars_data.forEach(async (bar: BarCreate) => {
      await BarServices.addBar(bar);
    });

    console.log("Database initialized.");
  } catch (e) {
    console.error("Database initialization failed: ", e);
  }
};
