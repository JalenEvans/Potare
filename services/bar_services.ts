import * as SQLite from "expo-sqlite";
import type { Bar, BarCreate, BarResponse } from "../types/bar";

let db: SQLite.SQLiteDatabase;

export const setBarDb = (database: SQLite.SQLiteDatabase) => {
  db = database;
};

export const initBarTable = async () => {
  // Drop and recreate to ensure correct schema
  await db.execAsync(`DROP TABLE IF EXISTS bar;`);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      latitude REAL,
      longitude REAL,
      rating REAL,
      notes TEXT
    );
  `);
};

const mapBar = (row: any): BarResponse => ({
  id: row.id,
  name: row.name,
  address: row.address ?? null,
  latitude: row.latitude ?? null,
  longitude: row.longitude ?? null,
  rating: row.rating ?? null,
  notes: row.notes ?? null,
});

export const getBars = async (): Promise<BarResponse[]> => {
  const rows = await db.getAllAsync(`SELECT * FROM bar ORDER BY name ASC`);
  return rows.map(mapBar);
};

export const getBarById = async (id: number): Promise<BarResponse | null> => {
  const row = await db.getFirstAsync(`SELECT * FROM bar WHERE id = ?`, id);
  return row ? mapBar(row) : null;
};

export const addBar = async (bar: BarCreate): Promise<void> => {
  await db.runAsync(
    `INSERT INTO bar (name, address, latitude, longitude, rating, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    bar.name,
    bar.address ?? null,
    bar.latitude ?? null,
    bar.longitude ?? null,
    bar.rating ?? null,
    bar.notes ?? null
  );
};

export const updateBar = async (bar: Bar): Promise<void> => {
  await db.runAsync(
    `UPDATE bar SET name = ?, address = ?, latitude = ?, longitude = ?, rating = ?, notes = ?
     WHERE id = ?`,
    bar.name,
    bar.address ?? null,
    bar.latitude ?? null,
    bar.longitude ?? null,
    bar.rating ?? null,
    bar.notes ?? null,
    bar.id
  );
};

export const deleteBar = async (id: number): Promise<void> => {
  await db.runAsync(`DELETE FROM bar WHERE id = ?`, id);
};

export const seedBars = async (bars: BarCreate[]): Promise<void> => {
  const existing = await db.getAllAsync(`SELECT id FROM bar LIMIT 1`);
  if (existing.length > 0) return;
  for (const bar of bars) {
    await addBar(bar);
  }
};

export const geocodeAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const query = encodeURIComponent(address);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { "User-Agent": "PotareApp/1.0" } }
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
};

export const backfillCoords = async (): Promise<void> => {
  const all = await getBars();
  for (const bar of all) {
    if (bar.latitude != null || !bar.address) continue;
    const coords = await geocodeAddress(bar.address);
    if (coords) {
      await updateBar({ ...bar, ...coords });
    }
  }
};