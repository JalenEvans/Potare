// app/(tabs)/profile.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.avatar} />
      <Text style={styles.name}>User Name</Text>
      <Text style={styles.stats}>Bars visited: 12</Text>
      <Text style={styles.stats}>Events been to: 4</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile (future)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '500', marginBottom: 8 },
  stats: { fontSize: 14, marginBottom: 4 },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  buttonText: { color: '#fff', fontWeight: '500' },
});
