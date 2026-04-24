import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { getUserByEmail, updateUser } from "../../../services/user_services";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");

  const handleSave = async () => {
    if (!user) return;
    const full = await getUserByEmail(user.email);
    if (!full) return;
    await updateUser({ ...full, username });
    Alert.alert("Saved!", "Your profile has been updated.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, styles.disabled]}
        value={user?.email}
        editable={false}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f9f9f9" },
  label: { fontSize: 13, color: "#888", marginBottom: 4, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    padding: 12, backgroundColor: "#fff", fontSize: 15,
  },
  disabled: { backgroundColor: "#f0f0f0", color: "#aaa" },
});