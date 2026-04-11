import type { BarStats } from "./bar_stats";

export type User = {
  id: number;
  username: string;
  email: string;
  hashedPassword: string;
  stats?: BarStats;
};

export type UserCreate = {
  username: string;
  email: string;
  hashedPassword: string;
  stats?: null;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  stats?: BarStats;
};
