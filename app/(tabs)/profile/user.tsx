import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View>
      <Text>profile</Text>
      <Button
        title="Go To Settings"
        onPress={() => router.push("/profile/settings")}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
