import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Camera, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Bar } from "@/types/bar";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locationGranted, setLocationGranted] = useState(false);

  const bars: Bar[] = [
    {
      id: 1,
      name: "Burns Alley Tavern",
      address: "354B King St, Charleston, SC 29401",
      coords: {
        latitude: 32.7850396,
        longitude: -79.9353964,
      },
    },
    {
      id: 2,
      name: "Big Gun Burger Shop & Bar",
      address: "137 Calhoun St, Charleston, SC 29401",
      coords: {
        latitude: 32.7861016,
        longitude: -79.9349774,
      },
    },
    {
      id: 3,
      name: "A.C.'s Bar & Grill",
      address: "467 King St, Charleston, SC 29403",
      coords: {
        latitude: 32.7890882,
        longitude: -79.9386555,
      },
    },
  ];

  useEffect(() => {
    async function requestLocationPermissions() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied.");
        setLocationGranted(false);

        Alert.alert(
          "Permission Denied",
          "Please allow location access in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Go to Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      setLocationGranted(true);
    }

    requestLocationPermissions();

    let subscription: Location.LocationSubscription | null = null;

    async function watchPosition() {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
        },
      );
    }

    watchPosition();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  if (!locationGranted || !location) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator />
        <Text>Loading Location Data...</Text>
      </View>
    );
  }

  const initCamera: Camera = {
    center: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    heading: 0,
    pitch: 0,
    zoom: 15,
  };

  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        initialCamera={initCamera}
      >
        {bars.map((bar: Bar) => (
          <Marker key={bar.id} coordinate={bar.coords} title={bar.name} />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
