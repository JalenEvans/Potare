import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { Bar } from "@/types/bar";
import * as BarServices from "@/database/bar_services";

export default function BarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBar() {
      const bars = await BarServices.getBars();
      const foundBar = bars.find((b) => String(b.id) === String(id)) ?? null;
      setBar(foundBar);
      setLoading(false);
    }

    loadBar();
  }, [id]);

  return (
    <>
      <Stack.Screen options={{ title: "Bar Details" }} />

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#111827" />
        ) : bar ? (
          <View style={styles.card}>
            <Text style={styles.title}>{bar.name}</Text>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{bar.address}</Text>

            <Text style={styles.label}>Latitude</Text>
            <Text style={styles.value}>{bar.coords.latitude}</Text>

            <Text style={styles.label}>Longitude</Text>
            <Text style={styles.value}>{bar.coords.longitude}</Text>

            <Text style={styles.label}>Bar ID</Text>
            <Text style={styles.value}>{bar.id}</Text>
          </View>
        ) : (
          <Text style={styles.notFound}>Bar not found.</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#111827",
  },
  notFound: {
    fontSize: 18,
    textAlign: "center",
    color: "#DC2626",
  },
});