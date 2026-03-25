import MapView, { Marker, Region } from 'react-native-maps';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

const INITIAL_REGION: Region = {
  latitude: 32.7765,
  longitude: -79.9311,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const LOCATIONS = [
  { id: '1', title: 'Bar One', latitude: 32.7765, longitude: -79.9311 },
  { id: '2', title: 'Bar Two', latitude: 32.781, longitude: -79.94 },
];

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={INITIAL_REGION}>
        {LOCATIONS.map((loc) => (
          <Link
            key={loc.id}
            href={{ pathname: '/detail/[id]', params: { id: loc.id } }}
            asChild
          >
            <Marker
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              title={loc.title}
            />
          </Link>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
});

