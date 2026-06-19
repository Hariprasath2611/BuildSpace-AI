import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native'
import { useAttendanceStore, ClockRecord } from '../store/attendanceStore'
import { useSettingsStore } from '../store/settingsStore'
import { useLocation } from '../hooks/useLocation'

export default function AttendanceScreen() {
  const { isDarkMode } = useSettingsStore()
  const { isClockedIn, lastClockRecord, history, clockIn, clockOut } = useAttendanceStore()
  const { coords, requestPermission } = useLocation()
  
  const [method, setMethod] = useState<'GPS' | 'QR' | 'Face'>('GPS')

  const handleClockToggle = async () => {
    await requestPermission()
    
    if (isClockedIn) {
      await clockOut(coords.latitude, coords.longitude, method)
      Alert.alert("Clocked Out", `Method: ${method}\nLocation: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`)
    } else {
      await clockIn(coords.latitude, coords.longitude, method)
      Alert.alert("Clocked In", `Method: ${method}\nLocation: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`)
    }
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  const renderHistoryItem = ({ item }: { item: ClockRecord }) => (
    <View style={[styles.historyRow, cardStyle]}>
      <View>
        <Text style={[styles.histType, textStyle]}>
          {item.type === 'in' ? '🟢 Clocked In' : '🔴 Clocked Out'}
        </Text>
        <Text style={[styles.histMeta, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)} • Method: {item.method}
        </Text>
      </View>
      <Text style={[styles.histTime, textStyle]}>{item.timestamp.split(' ')[1] || item.timestamp}</Text>
    </View>
  )

  return (
    <View style={[styles.container, bgStyle]}>
      {/* Clock Controller card */}
      <View style={[styles.clockCard, cardStyle]}>
        <Text style={[styles.clockTitle, textStyle]}>
          {isClockedIn ? "Active Shift In Progress" : "You are currently Clocked Out"}
        </Text>
        <Text style={[styles.clockCoords, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          GPS Lock: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
        </Text>

        {/* Method Picker */}
        <View style={styles.methodSelector}>
          {(['GPS', 'QR', 'Face'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.methodBtn, method === m ? styles.methodBtnActive : null]}
              onPress={() => setMethod(m)}
            >
              <Text style={[styles.methodText, method === m ? styles.methodTextActive : textStyle]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.clockBtn, isClockedIn ? styles.clockBtnOut : styles.clockBtnIn]}
          onPress={handleClockToggle}
        >
          <Text style={styles.clockBtnText}>
            {isClockedIn ? "CLOCK OUT NOW" : "CLOCK IN NOW"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clock logs list */}
      <Text style={[styles.sectionTitle, textStyle]}>Today's Shift Log</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.list}
      />
    </View>
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
  clockCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 25,
  },
  clockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clockCoords: {
    fontSize: 13,
    marginBottom: 20,
  },
  methodSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  methodBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  methodBtnActive: {
    backgroundColor: '#3B82F6',
  },
  methodText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  methodTextActive: {
    color: '#FFFFFF',
  },
  clockBtn: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockBtnIn: {
    backgroundColor: '#10B981',
  },
  clockBtnOut: {
    backgroundColor: '#EF4444',
  },
  clockBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  histType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  histMeta: {
    fontSize: 11,
  },
  histTime: {
    fontSize: 13,
    fontWeight: 'bold',
  }
})
