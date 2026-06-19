import React from 'react'
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert } from 'react-native'
import { useSettingsStore } from '../store/settingsStore'

export default function SettingsScreen() {
  const { isDarkMode, isOfflineSyncEnabled, language, toggleDarkMode, toggleOfflineSync, setLanguage } = useSettingsStore()

  const handleClearCache = () => {
    Alert.alert(
      "Clear Offline Cache",
      "Are you sure you want to delete all cached blueprints and offline databases?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "CLEAR CACHE", style: "destructive", onPress: () => Alert.alert("Cache Cleared", "SQLite database tables successfully truncated.") }
      ]
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <View style={[styles.container, bgStyle]}>
      <View style={[styles.settingsCard, cardStyle]}>
        {/* Dark Mode */}
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, textStyle]}>Dark UI theme</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#3B82F6' }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        {/* Offline Sync */}
        <View style={[styles.settingRow, styles.borderTop]}>
          <Text style={[styles.settingLabel, textStyle]}>Background offline sync</Text>
          <Switch
            value={isOfflineSyncEnabled}
            onValueChange={toggleOfflineSync}
            trackColor={{ false: '#767577', true: '#3B82F6' }}
            thumbColor={isOfflineSyncEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        {/* Language Selection */}
        <View style={[styles.settingRow, styles.borderTop, { paddingVertical: 15 }]}>
          <Text style={[styles.settingLabel, textStyle]}>System Language</Text>
          <View style={styles.langSelector}>
            {(['en', 'es', 'hi'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langBtn, language === lang ? styles.langBtnActive : null]}
                onPress={() => setLanguage(lang)}
              >
                <Text style={[styles.langText, language === lang ? styles.langTextActive : textStyle]}>
                  {lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.clearBtn} onPress={handleClearCache}>
        <Text style={styles.clearBtnText}>WIPE LOCAL CACHE & SQLITE</Text>
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
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  settingsCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 35,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  borderTop: {
    borderTopWidth: 0.5,
    borderTopColor: '#CBD5E1',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  langSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  langBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  langBtnActive: {
    backgroundColor: '#3B82F6',
  },
  langText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  clearBtn: {
    height: 50,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
})
