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
import * as BarServices from "@/database/bar_services";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locationGranted, setLocationGranted] = useState(false);
  const [bars, setBars] = useState<Bar[]>([]);

  useEffect(() => {
    async function fetchBars() {
      const result = await BarServices.getBars();
      setBars(result);
    }

    fetchBars();
  }, []);

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
          <Marker
            key={bar.id}
            coordinate={bar.coords}
            title={bar.name}
            description={bar.id.toString()}
          />
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
