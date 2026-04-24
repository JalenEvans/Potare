import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";

export default function UserProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.username?.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.username}>{user?.username}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{user?.stats?.bars_visited ?? 0}</Text>
          <Text style={styles.statLabel}>Bars Visited</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{user?.stats?.events_attended ?? 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/(tabs)/profile/edit-profile")}
      >
        <Ionicons name="create-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Edit Profile</Text>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/(tabs)/profile/settings")}
      >
        <Ionicons name="settings-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Settings</Text>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, backgroundColor: "#f9f9f9" },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#E63946", justifyContent: "center", alignItems: "center",
    marginTop: 24, marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "700" },
  username: { fontSize: 22, fontWeight: "700", color: "#1a1a2e" },
  email: { fontSize: 14, color: "#888", marginBottom: 24 },
  statsRow: { flexDirection: "row", gap: 24, marginBottom: 32 },
  statBox: { alignItems: "center" },
  statNum: { fontSize: 24, fontWeight: "700", color: "#E63946" },
  statLabel: { fontSize: 12, color: "#888" },
  menuItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    width: "100%", marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  menuText: { flex: 1, fontSize: 15 },
  logoutBtn: {
    marginTop: 16, backgroundColor: "#E63946",
    borderRadius: 12, padding: 16, width: "100%", alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});