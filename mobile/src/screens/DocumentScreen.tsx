import React, { useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useSettingsStore } from '../store/settingsStore'

interface DocumentItem {
  id: string
  title: string
  category: 'Blueprint' | 'Contract' | 'Permit' | 'BOQ'
  size: string
  isDownloadedOffline: boolean
}

const INITIAL_DOCS: DocumentItem[] = [
  { id: "doc_1", title: "Tower A Structural Framing Drawing", category: "Blueprint", size: "14.2 MB", isDownloadedOffline: true },
  { id: "doc_2", title: "Apex Masonry Subcontractor Deal", category: "Contract", size: "2.4 MB", isDownloadedOffline: false },
  { id: "doc_3", title: "Concrete Foundation Bill of Quantities", category: "BOQ", size: "1.1 MB", isDownloadedOffline: true },
  { id: "doc_4", title: "Scaffolding Safety Work Permit", category: "Permit", size: "450 KB", isDownloadedOffline: false }
]

export default function DocumentScreen() {
  const { isDarkMode } = useSettingsStore()
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleDownloadDoc = (id: string) => {
    setDownloadingId(id)
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, isDownloadedOffline: true } : d))
      )
      setDownloadingId(null)
      Alert.alert("Download Completed", "Document successfully saved to offline SQLite encrypted container.")
    }, 1500)
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  const renderDocItem = ({ item }: { item: DocumentItem }) => (
    <View style={[styles.docCard, cardStyle]}>
      <View>
        <Text style={[styles.docTitle, textStyle]}>{item.title}</Text>
        <Text style={[styles.docMeta, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Type: {item.category} • Size: {item.size}
        </Text>
      </View>
      <View style={styles.actions}>
        {item.isDownloadedOffline ? (
          <Text style={styles.downloadedBadge}>OFFLINE AVAILABLE</Text>
        ) : downloadingId === item.id ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <TouchableOpacity style={styles.dlBtn} onPress={() => handleDownloadDoc(item.id)}>
            <Text style={styles.dlBtnText}>SAVE OFFLINE</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return (
    <View style={[styles.container, bgStyle]}>
      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        renderItem={renderDocItem}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  list: {
    paddingVertical: 15,
  },
  docCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: 200,
    lineHeight: 18,
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 11,
  },
  actions: {
    alignItems: 'flex-end',
  },
  downloadedBadge: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 11,
  },
  dlBtn: {
    borderColor: '#3B82F6',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dlBtnText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: 'bold',
  }
})
