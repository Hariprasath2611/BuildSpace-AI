import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAuthStore } from '../store/authStore'
import { useDashboardStore } from '../store/dashboardStore'
import { useSettingsStore } from '../store/settingsStore'
import { RootStackParamList } from '../navigation/types'

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { isDarkMode } = useSettingsStore()
  const { user } = useAuthStore()
  const { kpis, weatherTemp, weatherCondition, syncStatus } = useDashboardStore()

  const handleSosTrigger = () => {
    Alert.alert(
      "EMERGENCY ALVERT",
      "Are you sure you want to broadcast a safety SOS alert to all onsite crew members?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "SEND SOS ALERT", style: "destructive", onPress: () => Alert.alert("SOS Dispatched", "Emergency safety stand-down alerts emitted.") }
      ]
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <ScrollView style={[styles.container, bgStyle]}>
      <View style={styles.header}>
        <Text style={[styles.welcome, textStyle]}>Welcome, {user?.userName}</Text>
        <Text style={[styles.subtitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Role: {user?.role} • Status: {syncStatus.toUpperCase()}
        </Text>
      </View>

      {/* Weather & Alerts */}
      <View style={[styles.weatherRow, cardStyle]}>
        <View>
          <Text style={[styles.weatherTemp, textStyle]}>{weatherTemp}</Text>
          <Text style={[styles.weatherCond, isDark ? styles.textMutedDark : styles.textMutedLight]}>{weatherCondition}</Text>
        </View>
        <TouchableOpacity style={styles.sosBtn} onPress={handleSosTrigger}>
          <Text style={styles.sosText}>SAFETY SOS</Text>
        </TouchableOpacity>
      </View>

      {/* KPIs Grid */}
      <Text style={[styles.sectionTitle, textStyle]}>Site Telemetry KPIs</Text>
      <View style={styles.grid}>
        <View style={[styles.gridCard, cardStyle]}>
          <Text style={[styles.kpiValue, { color: '#3B82F6' }]}>{kpis.progressPercentage}%</Text>
          <Text style={[styles.kpiLabel, textStyle]}>Site Progress</Text>
        </View>
        <View style={[styles.gridCard, cardStyle]}>
          <Text style={[styles.kpiValue, { color: '#10B981' }]}>{kpis.activeWorkers}</Text>
          <Text style={[styles.kpiLabel, textStyle]}>Active Workers</Text>
        </View>
        <View style={[styles.gridCard, cardStyle]}>
          <Text style={[styles.kpiValue, { color: '#EF4444' }]}>{kpis.openSafetyHazards}</Text>
          <Text style={[styles.kpiLabel, textStyle]}>Open Hazards</Text>
        </View>
        <View style={[styles.gridCard, cardStyle]}>
          <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>${(kpis.budgetSpent / 1000).toFixed(0)}k</Text>
          <Text style={[styles.kpiLabel, textStyle]}>Budget Spent</Text>
        </View>
      </View>

      {/* Quick Access List */}
      <Text style={[styles.sectionTitle, textStyle]}>Operation Modules</Text>
      <View style={styles.actionColumn}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionBtn, cardStyle]} onPress={() => navigation.navigate('Documents')}>
            <Text style={[styles.actionBtnText, textStyle]}>Blueprint Viewer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, cardStyle]} onPress={() => navigation.navigate('Materials')}>
            <Text style={[styles.actionBtnText, textStyle]}>Inventory & Stock</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionBtn, cardStyle]} onPress={() => navigation.navigate('Finance')}>
            <Text style={[styles.actionBtnText, textStyle]}>Finance ledgers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, cardStyle]} onPress={() => navigation.navigate('MapTracking')}>
            <Text style={[styles.actionBtnText, textStyle]}>Worker GPS Maps</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionBtn, cardStyle]} onPress={() => navigation.navigate('ChatRoom', { channelId: "main_chat", title: "General Chat" })}>
            <Text style={[styles.actionBtnText, textStyle]}>Operations Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, cardStyle]} onPress={() => navigation.navigate('Settings')}>
            <Text style={[styles.actionBtnText, textStyle]}>App Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  header: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 25,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weatherCond: {
    fontSize: 14,
  },
  sosBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  gridCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionColumn: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionBtn: {
    width: '48%',
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
})
