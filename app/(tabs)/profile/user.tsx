import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../../context/ProfileContext';

export default function UserScreen() {
  const { username, joinedDate } = useProfile();

  const barsVisited = 18;
  const eventsAttended = 7;

  const barsGoal = 25;
  const eventsGoal = 10;

  const barsProgress = `${Math.min((barsVisited / barsGoal) * 100, 100)}%`;
  const eventsProgress = `${Math.min(
    (eventsAttended / eventsGoal) * 100,
    100
  )}%`;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.push('/(tabs)/profile/settings')}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={20} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.avatar} />
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.joinedDate}>Joined {joinedDate}</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.statsTitle}>Stats</Text>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Bars visited</Text>
              <Text style={styles.statValue}>
                {barsVisited}/{barsGoal}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFillBlue, { width: barsProgress }]}
              />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Events attended</Text>
              <Text style={styles.statValue}>
                {eventsAttended}/{eventsGoal}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFillGreen, { width: eventsProgress }]}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    minHeight: 44,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  topSection: {
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#CBD5E1',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  joinedDate: {
    fontSize: 15,
    color: '#6B7280',
  },
  bottomSection: {
    flex: 1,
    paddingTop: 8,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  progressTrack: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFillBlue: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
  progressFillGreen: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#10B981',
  },
});