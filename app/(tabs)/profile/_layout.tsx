import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="user"
        options={{ headerShown: true, title: "User" }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: true, title: "Settings" }}
      />
    </Stack>
  );
}
