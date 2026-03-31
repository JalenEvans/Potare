import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [privateProfileEnabled, setPrivateProfileEnabled] = useState(false);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace('/(tabs)/profile/user')}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </Pressable>

        <Text style={styles.screenTitle}>Settings</Text>

        <View style={styles.iconSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable
            style={styles.row}
            onPress={() => router.push('/(tabs)/profile/edit-profile')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="person-outline" size={20} color="#111827" />
              <Text style={styles.rowLabel}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color="#111827" />
              <Text style={styles.rowLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={notificationsEnabled ? '#2563EB' : '#F9FAFB'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={20} color="#111827" />
              <Text style={styles.rowLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
              thumbColor={darkModeEnabled ? '#059669' : '#F9FAFB'}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#111827" />
              <Text style={styles.rowLabel}>Private Profile</Text>
            </View>
            <Switch
              value={privateProfileEnabled}
              onValueChange={setPrivateProfileEnabled}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={privateProfileEnabled ? '#7C3AED' : '#F9FAFB'}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support</Text>

          <Pressable
            style={styles.row}
            onPress={() => Alert.alert('Help', 'Help screen coming soon.')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="help-circle-outline" size={20} color="#111827" />
              <Text style={styles.rowLabel}>Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.row}
            onPress={() =>
              Alert.alert('Log Out', 'Log out functionality coming soon.')
            }
          >
            <View style={styles.rowLeft}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={[styles.rowLabel, styles.logoutText]}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: 36,
    height: 36,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 48,
  },
  logoutText: {
    color: '#DC2626',
  },
});