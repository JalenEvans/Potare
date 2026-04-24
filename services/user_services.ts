import * as SQLite from "expo-sqlite";
import type { User, UserCreate, UserResponse } from "../types/user";

let db: SQLite.SQLiteDatabase;

export const setDb = (database: SQLite.SQLiteDatabase) => {
  db = database;
};

const mapUserResponse = (row: any): UserResponse => ({
  id: row.id,
  username: row.username,
  email: row.email,
  stats: row.stats ? JSON.parse(row.stats) : null,
});

const mapUser = (row: any): User => ({
  id: row.id,
  username: row.username,
  email: row.email,
  hashedPassword: row.hashedPassword,
  stats: row.stats ? JSON.parse(row.stats) : null,
});

export const initUserTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      hashedPassword TEXT NOT NULL,
      stats TEXT
    );
  `);
};

export const addUser = async (user: UserCreate) => {
  await db.runAsync(
    `INSERT INTO user (username, email, hashedPassword, stats) VALUES (?, ?, ?, ?)`,
    user.username,
    user.email.toLowerCase(),
    user.hashedPassword,
    user.stats ? JSON.stringify(user.stats) : null
  );
};

export const getUsers = async (): Promise<UserResponse[]> => {
  const rows = await db.getAllAsync(`SELECT * FROM user ORDER BY id DESC`);
  return rows.map(mapUserResponse);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const row = await db.getFirstAsync(
    `SELECT * FROM user WHERE email = ?`,
    email.toLowerCase()
  );
  return row ? mapUser(row) : null;
};

export const getUserById = async (id: number): Promise<UserResponse | null> => {
  const row = await db.getFirstAsync(`SELECT * FROM user WHERE id = ?`, id);
  return row ? mapUserResponse(row) : null;
};

export const updateUser = async (user: User) => {
  await db.runAsync(
    `UPDATE user SET username = ?, email = ?, hashedPassword = ?, stats = ? WHERE id = ?`,
    user.username,
    user.email.toLowerCase(),
    user.hashedPassword,
    user.stats ? JSON.stringify(user.stats) : null,
    user.id
  );
};

export const deleteUser = async (userId: number) => {
  await db.runAsync(`DELETE FROM user WHERE id = ?`, userId);
};