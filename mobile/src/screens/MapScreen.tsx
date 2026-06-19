import React from 'react'
import { StyleSheet, View, Text, Alert, Dimensions, TouchableOpacity } from 'react-native'
import { useSettingsStore } from '../store/settingsStore'
import { useLocation } from '../hooks/useLocation'

export default function MapScreen() {
  const { isDarkMode } = useSettingsStore()
  const { coords } = useLocation()

  const handleTestGeofence = () => {
    Alert.alert(
      "Geofence Checked",
      "Sector C hazard geofence active.\nYour current distance to boundary: 15 meters.\nStatus: SAFE (Outside Danger Area)."
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <View style={[styles.container, bgStyle]}>
      {/* Map simulation container */}
      <View style={[styles.mapPlaceholder, cardStyle]}>
        <Text style={[styles.mapText, textStyle]}>🗺️ Google Maps SDK Active</Text>
        <Text style={[styles.coordsText, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          User Marker: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
        </Text>
        
        {/* Mock asset hotspots */}
        <View style={styles.hotspots}>
          <Text style={styles.hotspotText}>🏗️ Tower Crane #2: Connected (Telemetry OK)</Text>
          <Text style={styles.hotspotText}>👷 Site Crew Sector B: 18 Workers active</Text>
          <Text style={styles.hotspotText}>🚚 Supply Delivery Concrete: ETA 12 mins</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.testBtn} onPress={handleTestGeofence}>
        <Text style={styles.testBtnText}>TEST SAFETY GEOFENCE LIMITS</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  mapPlaceholder: {
    width: '100%',
    height: Dimensions.get('window').height * 0.5,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 25,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  coordsText: {
    fontSize: 13,
    marginBottom: 20,
  },
  hotspots: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#CBD5E1',
  },
  hotspotText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 10,
  },
  testBtn: {
    backgroundColor: '#EF4444',
    height: 50,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
})
