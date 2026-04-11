import * as SQLite from "expo-sqlite";
import type { User, UserCreate, UserResponse } from "@/types/user";

let db: SQLite.SQLiteDatabase;

const set_db = (database: SQLite.SQLiteDatabase) => {
  db = database;
};

const addUser = async (user: UserCreate) => {
  try {
    await db.runAsync(
      `INSERT INTO user (username, email, hashedPassword, stats)
            VALUES (?, ?, ?, ?)`,
      [user.username, user.email, user.hashedPassword, user.stats ?? null],
    );
  } catch (e) {
    console.error(`Error adding User: ${user}.`, e);
  }
};

const getUsers = async (): Promise<UserResponse[]> => {
  try {
    const rows = await db.getAllSync(
      `SELECT * FROM user
            ORDER BY id DESC;`,
    );

    const users: UserResponse[] = rows.map((row: any) => ({
      id: row.id,
      username: row.username,
      email: row.email,
      stats: JSON.parse(row.stats) ?? null,
    }));

    return users;
  } catch (e) {
    console.error("Error fetching Users", e);
    return [];
  }
};

const updateUser = async (user: User) => {
  try {
    await db.runAsync(
      `UPDATE user
            SET username = ?, email = ?
            WHERE id = ?;`,
      [user.username, user.email, user.id],
    );
  } catch (e) {
    console.error(`Error updating User: ${user}.`, e);
  }
};

const deleteUser = async (user: User) => {
  try {
    await db.runAsync(`DELETE FROM user WHERE id = ?`, [user.id]);
  } catch (e) {
    console.error(`Error deleting User: ${user}.`, e);
  }
};
