import { Stack } from "expo-router";
import { ProfileProvider } from "../context/ProfileContext";
import { initDatabase } from "@/database/db";

initDatabase();

export default function RootLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileProvider>
  );
}
