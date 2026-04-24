import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import type { BarResponse } from "../../types/bar";
import { getBars } from "../../services/bar_services";

export default function MapScreen() {
  const [bars, setBars] = useState<BarResponse[]>([]);
  const [region, setRegion] = useState({
    latitude: 32.7765,
    longitude: -79.9311,
    latitudeDelta: 0.05,   // zoomed out enough to see all 3 bars
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    const load = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion((r) => ({
          ...r,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      }
      const data = await getBars();
      const located = data.filter(
        (b) => b.latitude != null && b.longitude != null
      );
      console.log("MAP BARS:", JSON.stringify(located));
      setBars(located);
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {bars.map((bar) => (
          <Marker
            key={bar.id}
            coordinate={{
              latitude: bar.latitude!,
              longitude: bar.longitude!,
            }}
            pinColor="#E63946"
            title={bar.name}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{bar.name}</Text>
                {bar.address ? (
                  <Text style={styles.calloutAddress}>{bar.address}</Text>
                ) : null}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { padding: 6, maxWidth: 200 },
  calloutTitle: { fontWeight: "700", fontSize: 14 },
  calloutAddress: { fontSize: 12, color: "#555", marginTop: 2 },
});