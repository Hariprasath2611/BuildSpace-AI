import React from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useProjectStore, Project } from '../store/projectStore'
import { useSettingsStore } from '../store/settingsStore'
import { RootStackParamList } from '../navigation/types'

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>

export default function ProjectsScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { isDarkMode } = useSettingsStore()
  const { projects } = useProjectStore()

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  const renderProjectItem = ({ item }: { item: Project }) => {
    return (
      <TouchableOpacity
        style={[styles.projectCard, cardStyle]}
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
      >
        <Text style={[styles.projectName, textStyle]}>{item.name}</Text>
        <Text style={[styles.projectLoc, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          📍 {item.location}
        </Text>

        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, textStyle]}>Completion Progress</Text>
          <Text style={[styles.progressPercent, textStyle]}>{item.progress}%</Text>
        </View>
        <View style={[styles.progressTrack, isDark ? styles.trackDark : styles.trackLight]}>
          <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.budget, textStyle]}>Budget: ${(item.budget / 1000000).toFixed(1)}M</Text>
          <Text style={styles.milestoneLink}>View Milestones →</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, bgStyle]}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectItem}
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
  trackLight: { backgroundColor: '#E2E8F0' },
  trackDark: { backgroundColor: '#334155' },
  list: {
    paddingVertical: 15,
  },
  projectCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  projectLoc: {
    fontSize: 14,
    marginBottom: 15,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budget: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  milestoneLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: 'bold',
  }
})
