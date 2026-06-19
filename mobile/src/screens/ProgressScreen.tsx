import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useProjectStore } from '../store/projectStore'
import { useSettingsStore } from '../store/settingsStore'
import { syncService } from '../services/sync'
import { RootStackParamList } from '../navigation/types'

type ProgressRouteProp = RouteProp<RootStackParamList, 'ProgressUpload'>

export default function ProgressScreen() {
  const route = useRoute<ProgressRouteProp>()
  const { isDarkMode } = useSettingsStore()
  const { addProjectMedia } = useProjectStore()

  const { projectId } = route.params
  const [offlineQueueCount, setOfflineQueueCount] = useState(0)

  const handleCapturePhoto = async () => {
    // In production, trigger react-native-image-picker or react-native-vision-camera.
    // Simulate capturing and saving photo.
    const mockPhotoUrl = `https://example.com/progress_${Date.now()}.jpg`
    
    // Add to project store locally
    addProjectMedia(projectId, 'image', mockPhotoUrl)

    // Push upload request to SQLite offline sync queue
    await syncService.queueRequest('/progress/upload', 'POST', {
      projectId,
      mediaUrl: mockPhotoUrl,
      type: 'image',
      capturedAt: new Date().toISOString()
    })

    setOfflineQueueCount((prev) => prev + 1)
    Alert.alert(
      "Media Captured",
      "Site photo successfully captured. Upload request added to SQLite offline-first sync queue."
    )
  }

  const handleSyncQueue = async () => {
    if (offlineQueueCount === 0) {
      Alert.alert("Sync Queue Empty", "No pending background uploads.")
      return
    }
    await syncService.processSyncQueue()
    setOfflineQueueCount(0)
    Alert.alert("Sync Completed", "All offline queued uploads successfully pushed to BuildSpace API.")
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <ScrollView style={[styles.container, bgStyle]} contentContainerStyle={styles.content}>
      <View style={[styles.captureBox, cardStyle]}>
        <Text style={[styles.boxTitle, textStyle]}>Progress Media Capture</Text>
        <Text style={[styles.boxDesc, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Record site photos, drone captures, or structural checks to generate timeline comparisons.
        </Text>

        <TouchableOpacity style={styles.captureBtn} onPress={handleCapturePhoto}>
          <Text style={styles.captureBtnText}>📷 CAPTURE PHOTO</Text>
        </TouchableOpacity>
      </View>

      {/* Queue manager status */}
      <View style={[styles.queueCard, cardStyle]}>
        <Text style={[styles.queueTitle, textStyle]}>Offline Sync Queue Status</Text>
        <Text style={[styles.queueCount, { color: offlineQueueCount > 0 ? '#F59E0B' : '#10B981' }]}>
          {offlineQueueCount} pending background uploads
        </Text>
        
        <TouchableOpacity style={styles.syncBtn} onPress={handleSyncQueue}>
          <Text style={styles.syncBtnText}>FLUSH SYNC QUEUE</Text>
        </TouchableOpacity>
      </View>
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
  captureBox: {
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 25,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  boxDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 25,
  },
  captureBtn: {
    backgroundColor: '#3B82F6',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  queueCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  queueTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  queueCount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  syncBtn: {
    backgroundColor: '#10B981',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
})
