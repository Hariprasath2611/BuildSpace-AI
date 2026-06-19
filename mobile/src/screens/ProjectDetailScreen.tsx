import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useProjectStore } from '../store/projectStore'
import { useSettingsStore } from '../store/settingsStore'
import { RootStackParamList } from '../navigation/types'

type ProjectDetailRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>
type NavigationProp = StackNavigationProp<RootStackParamList, 'ProjectDetail'>

export default function ProjectDetailScreen() {
  const route = useRoute<ProjectDetailRouteProp>()
  const navigation = useNavigation<NavigationProp>()
  const { isDarkMode } = useSettingsStore()
  const { projects } = useProjectStore()

  const { projectId } = route.params
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <View style={[styles.container, isDarkMode ? styles.bgDark : styles.bgLight, styles.centered]}>
        <Text style={isDarkMode ? styles.textDark : styles.textLight}>Project not found.</Text>
      </View>
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <ScrollView style={[styles.container, bgStyle]}>
      <View style={styles.header}>
        <Text style={[styles.title, textStyle]}>{project.name}</Text>
        <Text style={[styles.loc, isDark ? styles.textMutedDark : styles.textMutedLight]}>📍 {project.location}</Text>
      </View>

      {/* Action Buttons Grid */}
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('TaskBoard', { projectId: project.id })}>
          <Text style={styles.navBtnText}>Task Kanban</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('ProgressUpload', { projectId: project.id })}>
          <Text style={styles.navBtnText}>Upload Media</Text>
        </TouchableOpacity>
      </View>

      {/* Milestones Listing */}
      <Text style={[styles.sectionTitle, textStyle]}>Milestones & Timeline</Text>
      {project.milestones.map((m) => (
        <View key={m.id} style={[styles.milestoneCard, cardStyle]}>
          <View style={styles.milestoneHeader}>
            <Text style={[styles.milestoneName, textStyle]}>{m.name}</Text>
            <View style={[styles.badge, m.status === 'completed' ? styles.badgeSuccess : styles.badgePending]}>
              <Text style={styles.badgeText}>{m.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.milestoneDate, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            Target Date: {m.date}
          </Text>
        </View>
      ))}

      {/* Project Media */}
      <Text style={[styles.sectionTitle, textStyle]}>Site Photos & Drone Captures</Text>
      {project.media.length === 0 ? (
        <Text style={[styles.emptyText, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          No photo attachments logged yet.
        </Text>
      ) : (
        <View style={styles.mediaContainer}>
          {project.media.map((med) => (
            <View key={med.id} style={[styles.mediaPlaceholder, cardStyle]}>
              <Text style={textStyle}>[Image: {med.type.toUpperCase()}]</Text>
              <Text style={[styles.mediaTime, isDark ? styles.textMutedDark : styles.textMutedLight]}>
                {med.timestamp}
              </Text>
            </View>
          ))}
        </View>
      )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loc: {
    fontSize: 14,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  navBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  navBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  milestoneCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  milestoneName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  milestoneDate: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: '#10B981',
  },
  badgePending: {
    backgroundColor: '#F59E0B',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mediaPlaceholder: {
    width: '48%',
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  mediaTime: {
    fontSize: 10,
    marginTop: 8,
  }
})
