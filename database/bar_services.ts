import * as SQLite from "expo-sqlite";
import type { Bar, BarCreate, BarResponse } from "@/types/bar";

let db: SQLite.SQLiteDatabase;

const set_db = (database: SQLite.SQLiteDatabase) => {
  db = database;
};

const addBar = async (bar: BarCreate) => {
  try {
    await db.runAsync(
      `INSERT INTO bar (name, address, coords)
            VALUES (?, ?, ?);`,
      [bar.name, bar.address, JSON.stringify(bar.coords)],
    );
  } catch (e) {
    console.error(`Error adding Bar: ${bar}.`, e);
  }
};

const getBars = async (): Promise<BarResponse[]> => {
  try {
    const rows = await db.getAllAsync(
      `SELECT * FROM bar
            ORDER BY id DESC;`,
    );

    const bars: BarResponse[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      coords: JSON.parse(row.coords),
    }));

    return bars;
  } catch (e) {
    console.error("Error fetching Bars", e);
    return [];
  }
};

const updateBar = async (bar: Bar) => {
  try {
    await db.runAsync(
      `UPDATE bar
            SET name = ?, address = ?, coords = ?
            WHERE id = ?;`,
      [bar.name, bar.address, JSON.stringify(bar.coords), bar.id],
    );
  } catch (e) {
    console.error(`Error updating Bar: ${bar}.`, e);
  }
};

const deleteBar = async (bar: Bar) => {
  try {
    await db.runAsync(`DELETE FROM bar WHERE id = ?`, [bar.id]);
  } catch (e) {
    console.error(`Error deleting Bar: ${bar}.`, e);
  }
};

export { set_db, addBar, getBars, updateBar, deleteBar };
