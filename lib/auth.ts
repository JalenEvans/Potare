import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import type { UserCreate, UserResponse, LoginInput } from "../types/user";
import { addUser, getUserByEmail, getUserById } from "../services/user_services";

const SESSION_KEY = "potare_session_user_id";

export const hashPassword = async (password: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

export const signup = async (
  input: Omit<UserCreate, "hashedPassword"> & { password: string }
): Promise<UserResponse> => {
  const existing = await getUserByEmail(input.email);

  if (existing) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await hashPassword(input.password);

  await addUser({
    username: input.username,
    email: input.email,
    hashedPassword,
    stats: input.stats ?? null,
  });

  const created = await getUserByEmail(input.email);

  if (!created) {
    throw new Error("Unable to create user.");
  }

  await SecureStore.setItemAsync(SESSION_KEY, String(created.id));

  return {
    id: created.id,
    username: created.username,
    email: created.email,
    stats: created.stats ?? null,
  };
};

export const login = async (input: LoginInput): Promise<UserResponse> => {
  const user = await getUserByEmail(input.email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const hashedPassword = await hashPassword(input.password);

  if (user.hashedPassword !== hashedPassword) {
    throw new Error("Invalid email or password.");
  }

  await SecureStore.setItemAsync(SESSION_KEY, String(user.id));

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    stats: user.stats ?? null,
  };
};

export const logout = async () => {
  await SecureStore.deleteItemAsync(SESSION_KEY);
};

export const getCurrentUser = async (): Promise<UserResponse | null> => {
  const storedId = await SecureStore.getItemAsync(SESSION_KEY);

  if (!storedId) return null;

  return await getUserById(Number(storedId));
};