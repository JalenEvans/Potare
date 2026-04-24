import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUsers } from "../../services/user_services";
import type { UserResponse } from "../../types/user";

export default function GroupScreen() {
  const [users, setUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Group</Text>
      {users.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No users yet.</Text>
          <Text style={styles.emptySubText}>
            Sign up to see your group here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.email}>{item.email}</Text>
                {item.stats && (
                  <Text style={styles.stats}>
                    🍺 {item.stats.bars_visited} bars ·{" "}
                    {item.stats.events_attended} events
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  heading: { fontSize: 22, fontWeight: "700", padding: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E63946",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  name: { fontWeight: "700", fontSize: 15 },
  email: { fontSize: 12, color: "#888" },
  stats: { fontSize: 12, color: "#E63946", marginTop: 2 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#aaa" },
  emptySubText: { fontSize: 13, color: "#bbb" },
});