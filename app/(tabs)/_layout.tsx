import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          title: "Map",
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          headerShown: false,
          title: "Group",
        }}
      />
      <Tabs.Protected guard={true}>
        <Tabs.Screen
          name="compass"
          options={{
            headerShown: false,
            title: "Compass",
          }}
        />
      </Tabs.Protected>
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
