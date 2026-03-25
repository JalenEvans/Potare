import { Link } from 'expo-router';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

const ITEMS = [
  { id: '1', title: 'Item One' },
  { id: '2', title: 'Item Two' },
  { id: '3', title: 'Item Three' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: '/detail/[id]', params: { id: item.id } }}
            asChild
          >
            <Pressable style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>Tap for details</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: '500' },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 4 },
});
