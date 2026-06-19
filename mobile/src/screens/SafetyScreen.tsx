import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, FlatList } from 'react-native'
import { useSafetyStore, HazardRecord } from '../store/safetyStore'
import { useSettingsStore } from '../store/settingsStore'

export default function SafetyScreen() {
  const { isDarkMode } = useSettingsStore()
  const { hazards, isSosTriggered, triggerSos, logHazard, resolveHazard } = useSafetyStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high')
  const [location, setLocation] = useState('')

  const handleLogHazard = () => {
    if (!title || !description || !location) {
      Alert.alert("Validation Error", "Please fill in all hazard log fields.")
      return
    }
    logHazard({
      title,
      description,
      severity,
      location
    })
    setTitle('')
    setDescription('')
    setLocation('')
    Alert.alert("Hazard Logged", "Ticket created and EHS team notified.")
  }

  const handleSosPress = () => {
    const nextState = !isSosTriggered
    triggerSos(nextState)
    if (nextState) {
      Alert.alert("SOS TRIGGERED", "EHS site-wide alarm sent to all active contractor terminals.")
    } else {
      Alert.alert("SOS Cleared", "Emergency status reset.")
    }
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  const renderHazardItem = ({ item }: { item: HazardRecord }) => (
    <View style={[styles.hazardCard, cardStyle]}>
      <View style={styles.hazardHeader}>
        <Text style={[styles.hazardTitle, textStyle]}>{item.title}</Text>
        <View style={[styles.badge, item.severity === 'critical' ? styles.badgeCrit : styles.badgeHigh]}>
          <Text style={styles.badgeText}>{item.severity.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={[styles.hazardDesc, isDark ? styles.textMutedDark : styles.textMutedLight]}>{item.description}</Text>
      <Text style={[styles.hazardLoc, textStyle]}>📍 {item.location} • Status: {item.status}</Text>
      
      {item.status === 'Open' && (
        <TouchableOpacity style={styles.resolveBtn} onPress={() => resolveHazard(item.id)}>
          <Text style={styles.resolveBtnText}>MARK AS RESOLVED</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <ScrollView style={[styles.container, bgStyle]} contentContainerStyle={styles.content}>
      {/* SOS Alert */}
      <TouchableOpacity
        style={[styles.sosButton, isSosTriggered ? styles.sosActive : styles.sosInactive]}
        onPress={handleSosPress}
      >
        <Text style={styles.sosText}>
          {isSosTriggered ? "🚨 SITE SOS ALARM ACTIVE (CLEAR)" : "🚨 TRIGGER EMERGENCY SITE SOS"}
        </Text>
      </TouchableOpacity>

      {/* PPE Scanner simulation */}
      <View style={[styles.scannerCard, cardStyle]}>
        <Text style={[styles.scannerTitle, textStyle]}>YOLOv11 PPE Vision Scanner</Text>
        <Text style={[styles.scannerDesc, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Scan worker PPE checklist via vision camera. Checks for hard hats and vests in Sector geofences.
        </Text>
        <TouchableOpacity style={styles.scannerBtn} onPress={() => Alert.alert("PPE Check", "All scanned workers are wearing safety helmets and reflective vests.")}>
          <Text style={styles.scannerBtnText}>START VISION PPE CHECK</Text>
        </TouchableOpacity>
      </View>

      {/* Log hazard form */}
      <View style={[styles.formCard, cardStyle]}>
        <Text style={[styles.formTitle, textStyle]}>Report Hazard / Safe Condition</Text>
        
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Hazard title (e.g. Loose wiring)"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Description"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Location (e.g. Scaffolding east)"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleLogHazard}>
          <Text style={styles.submitBtnText}>LOG EHS TICKET</Text>
        </TouchableOpacity>
      </View>

      {/* Hazards listing */}
      <Text style={[styles.sectionTitle, textStyle]}>Active EHS Tickets ({hazards.length})</Text>
      <FlatList
        data={hazards}
        keyExtractor={(item) => item.id}
        renderItem={renderHazardItem}
        scrollEnabled={false}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
  sosButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  sosInactive: {
    backgroundColor: '#EF4444',
  },
  sosActive: {
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  scannerCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 25,
  },
  scannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scannerDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  scannerBtn: {
    backgroundColor: '#3B82F6',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  formCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 14,
  },
  inputLight: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  inputDark: {
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hazardCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  hazardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hazardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  hazardDesc: {
    fontSize: 13,
    marginBottom: 10,
  },
  hazardLoc: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  resolveBtn: {
    borderColor: '#10B981',
    borderWidth: 1,
    height: 35,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolveBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeCrit: { backgroundColor: '#EF4444' },
  badgeHigh: { backgroundColor: '#F59E0B' },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' }
})
