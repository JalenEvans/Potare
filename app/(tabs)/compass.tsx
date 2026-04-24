import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { getBars, backfillCoords } from "../../services/bar_services";
import type { BarResponse } from "../../types/bar";

// ── notification setup ────────────────────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function sendArrivalNotification(barName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've arrived! 🍺",
      body: `Welcome to ${barName}. Enjoy your visit!`,
      sound: true,
    },
    trigger: null, // fire immediately
  });
}

// ── helpers ───────────────────────────────────────────────────────────────────

function getBearing(
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLon = toRad(targetLon - userLon);
  const lat1 = toRad(userLat);
  const lat2 = toRad(targetLat);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function shortestAngle(current: number, target: number): number {
  const diff = ((target - current + 540) % 360) - 180;
  return current + diff;
}

// ── needle ────────────────────────────────────────────────────────────────────

const DIAL_SIZE = Math.min(Dimensions.get("window").width * 0.7, 280);
const NEEDLE_H = DIAL_SIZE * 0.38;

function CompassNeedle() {
  return (
    <View style={styles.needleContainer} pointerEvents="none">
      <View style={styles.needleNorth} />
      <View style={styles.needleDot} />
      <View style={styles.needleSouth} />
    </View>
  );
}

// ── screen ────────────────────────────────────────────────────────────────────

export default function CompassScreen() {
  const [bars, setBars] = useState<BarResponse[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [heading, setHeading] = useState(0);
  const [selectedBar, setSelectedBar] = useState<BarResponse | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [notifPermission, setNotifPermission] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const currentAngle = useRef(0);

  // ── notification permission ────────────────────────────────────────────────
  useEffect(() => {
    requestNotificationPermission().then(setNotifPermission);
  }, []);

  // ── reset arrived when bar changes ────────────────────────────────────────
  useEffect(() => {
    setArrived(false);
  }, [selectedBar]);

  // ── wait for db then load bars ─────────────────────────────────────────────
  useEffect(() => {
    const tryLoad = async () => {
      try {
        await backfillCoords();
        const all = await getBars();
        const located = all.filter(
          (b) => b.latitude != null && b.longitude != null
        );
        setBars(located);
        setDbReady(true);
      } catch (e) {
        setTimeout(tryLoad, 300);
      }
    };
    tryLoad();
  }, []);

  // ── location + heading ─────────────────────────────────────────────────────
  useEffect(() => {
    let headingSub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      setPermissionGranted(true);

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
      });

      headingSub = await Location.watchHeadingAsync((h) => {
        setHeading(h.trueHeading ?? h.magHeading);
      });
    })();

    return () => {
      headingSub?.remove();
    };
  }, []);

  // ── auto-select nearest ────────────────────────────────────────────────────
  useEffect(() => {
    if (!userLocation || bars.length === 0 || selectedBar) return;
    const nearest = [...bars].sort(
      (a, b) =>
        getDistance(userLocation.lat, userLocation.lon, a.latitude!, a.longitude!) -
        getDistance(userLocation.lat, userLocation.lon, b.latitude!, b.longitude!)
    )[0];
    setSelectedBar(nearest ?? null);
  }, [userLocation, bars]);

  // ── animate needle ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userLocation || !selectedBar?.latitude || !selectedBar?.longitude) return;

    const bearing = getBearing(
      userLocation.lat,
      userLocation.lon,
      selectedBar.latitude,
      selectedBar.longitude
    );

    const needleAngle = (bearing - heading + 360) % 360;
    const target = shortestAngle(currentAngle.current, needleAngle);
    currentAngle.current = target;

    Animated.spring(rotateAnim, {
      toValue: target,
      useNativeDriver: true,
      damping: 18,
      stiffness: 120,
    }).start();
  }, [heading, selectedBar, userLocation]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-720, 720],
    outputRange: ["-720deg", "720deg"],
    extrapolate: "extend",
  });

  const distanceLabel = (() => {
    if (!userLocation || !selectedBar?.latitude || !selectedBar?.longitude)
      return null;
    const mi = getDistance(
      userLocation.lat,
      userLocation.lon,
      selectedBar.latitude,
      selectedBar.longitude
    );
    return mi < 0.1 ? `${Math.round(mi * 5280)} ft` : `${mi.toFixed(2)} mi`;
  })();

  // ── arrived handler ────────────────────────────────────────────────────────
  const handleArrived = async () => {
    if (!selectedBar || arrived) return;
    setArrived(true);
    if (notifPermission) {
      await sendArrivalNotification(selectedBar.name);
    }
  };

  // ── loading states ─────────────────────────────────────────────────────────
  if (!dbReady) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Loading bars...</Text>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>
          Location permission is required for the compass.
        </Text>
      </View>
    );
  }

  if (bars.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>
          No bars with addresses yet.{"\n"}Add a bar with an address to use the
          compass.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* dial */}
      <View style={styles.dialWrapper}>
        <Text style={[styles.cardinal, styles.cardN]}>N</Text>
        <Text style={[styles.cardinal, styles.cardE]}>E</Text>
        <Text style={[styles.cardinal, styles.cardS]}>S</Text>
        <Text style={[styles.cardinal, styles.cardW]}>W</Text>
        <View style={styles.dial}>
          <Animated.View
            style={[styles.needleWrapper, { transform: [{ rotate }] }]}
          >
            <CompassNeedle />
          </Animated.View>
        </View>
      </View>

      {/* target info */}
      {selectedBar && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{selectedBar.name}</Text>
          {selectedBar.address ? (
            <Text style={styles.infoAddress}>{selectedBar.address}</Text>
          ) : null}
          {distanceLabel && (
            <Text style={styles.infoDistance}>{distanceLabel} away</Text>
          )}

          {/* I've Arrived button */}
          <TouchableOpacity
            style={[styles.arrivedBtn, arrived && styles.arrivedBtnDone]}
            onPress={handleArrived}
            activeOpacity={0.75}
            disabled={arrived}
          >
            <Text style={styles.arrivedBtnText}>
              {arrived ? "✓ Arrived!" : "I've Arrived"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* bar list */}
      <Text style={styles.listLabel}>Select a bar</Text>
      <FlatList
        data={bars}
        keyExtractor={(b) => String(b.id)}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => {
          const isSelected = selectedBar?.id === item.id;
          const dist =
            userLocation && item.latitude != null && item.longitude != null
              ? getDistance(
                  userLocation.lat,
                  userLocation.lon,
                  item.latitude,
                  item.longitude
                ).toFixed(2) + " mi"
              : null;

          return (
            <TouchableOpacity
              style={[styles.barRow, isSelected && styles.barRowSelected]}
              onPress={() => setSelectedBar(item)}
              activeOpacity={0.75}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.barName,
                    isSelected && styles.barNameSelected,
                  ]}
                >
                  {item.name}
                </Text>
                {item.address ? (
                  <Text style={styles.barAddress} numberOfLines={1}>
                    {item.address}
                  </Text>
                ) : null}
              </View>
              {dist && <Text style={styles.barDist}>{dist}</Text>}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 32,
  },
  permText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },

  // dial
  dialWrapper: {
    alignSelf: "center",
    width: DIAL_SIZE + 48,
    height: DIAL_SIZE + 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: 3,
    borderColor: "#2a2a2a",
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e63946",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  // cardinals
  cardinal: {
    position: "absolute",
    color: "#555",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardN: { top: 0, alignSelf: "center" },
  cardS: { bottom: 0, alignSelf: "center" },
  cardE: { right: 0, top: "50%" },
  cardW: { left: 0, top: "50%" },

  // needle
  needleWrapper: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  needleContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: NEEDLE_H * 2,
    width: 20,
  },
  needleNorth: {
    width: 14,
    height: NEEDLE_H,
    backgroundColor: "#e63946",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  needleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 2,
    zIndex: 10,
  },
  needleSouth: {
    width: 14,
    height: NEEDLE_H,
    backgroundColor: "#444",
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },

  // info card
  infoCard: {
    alignSelf: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    maxWidth: "90%",
  },
  infoTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  infoAddress: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
    textAlign: "center",
  },
  infoDistance: {
    color: "#e63946",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "600",
  },

  // arrived button
  arrivedBtn: {
    marginTop: 12,
    backgroundColor: "#e63946",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  arrivedBtnDone: {
    backgroundColor: "#2a2a2a",
  },
  arrivedBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  // list
  listLabel: {
    color: "#444",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  barRowSelected: {
    borderColor: "#e63946",
    backgroundColor: "#1f1010",
  },
  barName: {
    color: "#bbb",
    fontSize: 16,
  },
  barNameSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  barAddress: {
    color: "#444",
    fontSize: 12,
    marginTop: 2,
  },
  barDist: {
    color: "#444",
    fontSize: 13,
    marginLeft: 12,
  },
});