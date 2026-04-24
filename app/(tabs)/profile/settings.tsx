import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/signup");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ true: "#E63946" }}
        />
      </View>

      <Text style={styles.dangerHeading}>Danger Zone</Text>
      <View style={styles.dangerRow}>
        <Text style={styles.dangerText} onPress={handleDeleteAccount}>
          Delete Account
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f9f9f9" },
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  label: { fontSize: 15 },
  dangerHeading: { fontSize: 13, color: "#E63946", fontWeight: "700", marginTop: 24, marginBottom: 8 },
  dangerRow: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: "#fdd",
  },
  dangerText: { color: "#E63946", fontWeight: "600" },
});