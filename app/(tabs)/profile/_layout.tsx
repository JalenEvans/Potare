import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTintColor: "#fff", headerStyle: { backgroundColor: "#1a1a2e" } }}>
      <Stack.Screen name="user" options={{ title: "Profile" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}