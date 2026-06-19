import React from 'react'
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert } from 'react-native'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'

export default function ProfileScreen() {
  const { isDarkMode } = useSettingsStore()
  const { user, isBiometricsEnabled, setBiometrics, logout } = useAuthStore()

  const handleBiometricToggle = async (value: boolean) => {
    await setBiometrics(value)
    Alert.alert(
      "Biometrics Updated",
      value ? "Biometric authentication registered for future logins." : "Biometrics disabled."
    )
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirm",
      "Are you sure you want to end your active BuildSpace session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "LOGOUT", style: "destructive", onPress: () => logout() }
      ]
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <View style={[styles.container, bgStyle]}>
      {/* Profile info */}
      <View style={[styles.profileCard, cardStyle]}>
        <Text style={[styles.avatar, textStyle]}>👤</Text>
        <Text style={[styles.name, textStyle]}>{user?.userName}</Text>
        <Text style={[styles.role, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Role: {user?.role}
        </Text>
        <Text style={[styles.tenant, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Org ID: {user?.tenantId}
        </Text>
      </View>

      {/* Security Preferences */}
      <View style={[styles.settingCard, cardStyle]}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, textStyle]}>Use Fingerprint / Face ID</Text>
          <Switch
            value={isBiometricsEnabled}
            onValueChange={handleBiometricToggle}
            trackColor={{ false: '#767577', true: '#3B82F6' }}
            thumbColor={isBiometricsEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOG OUT SESSION</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  profileCard: {
    padding: 30,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    fontSize: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    marginBottom: 4,
  },
  tenant: {
    fontSize: 12,
  },
  settingCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 35,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutBtn: {
    height: 50,
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: 'bold',
  }
})
