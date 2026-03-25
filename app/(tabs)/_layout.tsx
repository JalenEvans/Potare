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
      {/* guard should be based on if the user is in a group or not */}
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
