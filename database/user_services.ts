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
      [
        user.username,
        user.email,
        user.hashedPassword,
        user.stats ? JSON.stringify(user.stats) : null,
      ],
    );
  } catch (e) {
    console.error("Error adding user:", e);
  }
};

const getUsers = async (): Promise<UserResponse[]> => {
  try {
    const rows = await db.getAllAsync(
      `SELECT * FROM user
       ORDER BY id DESC;`,
    );

    const users: UserResponse[] = rows.map((row: any) => ({
      id: row.id,
      username: row.username,
      email: row.email,
      stats: row.stats ? JSON.parse(row.stats) : undefined,
    }));

    return users;
  } catch (e) {
    console.error("Error fetching users:", e);
    return [];
  }
};

const updateUser = async (user: User) => {
  try {
    await db.runAsync(
      `UPDATE user
       SET username = ?, email = ?, hashedPassword = ?, stats = ?
       WHERE id = ?;`,
      [
        user.username,
        user.email,
        user.hashedPassword,
        user.stats ? JSON.stringify(user.stats) : null,
        user.id,
      ],
    );
  } catch (e) {
    console.error("Error updating user:", e);
  }
};

const deleteUser = async (user: User) => {
  try {
    await db.runAsync(`DELETE FROM user WHERE id = ?;`, [user.id]);
  } catch (e) {
    console.error("Error deleting user:", e);
  }
};

export { set_db, addUser, getUsers, updateUser, deleteUser };