import { Stack } from "expo-router";
import { useEffect } from "react";
import { openDatabaseSync } from "expo-sqlite";
import { AuthProvider } from "../context/AuthContext";
import { initUserTable, setDb } from "../services/user_services";
import { initBarTable, seedBars, setBarDb } from "../services/bar_services";
import { bars_data } from "../database/bars_data";

const database = openDatabaseSync("potare.db");

function DatabaseBootstrap() {
  useEffect(() => {
    const init = async () => {
      setDb(database);
      setBarDb(database);
      await initUserTable();
      await initBarTable();
      await database.runAsync(
        `DELETE FROM bar WHERE latitude IS NULL OR longitude IS NULL`
      );
      await seedBars(bars_data);

      // DEBUG — paste terminal output if bars still missing
      const rows = await database.getAllAsync(`SELECT * FROM bar`);
      console.log("BARS IN DB:", JSON.stringify(rows, null, 2));
    };
    init().catch(console.error);
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DatabaseBootstrap />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
  
}

