// app/detail/[id].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: `Detail ${id}` }} />
      <View style={styles.container}>
        <Text style={styles.header}>Detail Screen</Text>
        <Text style={styles.text}>Selected item id: {id}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
  text: { fontSize: 16 },
});
