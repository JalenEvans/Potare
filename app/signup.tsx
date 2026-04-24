import { useState } from "react";
import { Link, router } from "expo-router";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signUp({ username, email, password });
      router.replace("/(tabs)/map");
    } catch (error: any) {
      Alert.alert("Signup failed", error.message ?? "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Sign Up" onPress={handleSignup} />

      <Text style={styles.linkText}>
        Already have an account? <Link href="/login">Login</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  linkText: {
    marginTop: 12,
  },
});