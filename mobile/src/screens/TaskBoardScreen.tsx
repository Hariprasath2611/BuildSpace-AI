import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useTaskStore, Task } from '../store/taskStore'
import { useSettingsStore } from '../store/settingsStore'
import { RootStackParamList } from '../navigation/types'

type TaskBoardRouteProp = RouteProp<RootStackParamList, 'TaskBoard'>

export default function TaskBoardScreen() {
  const route = useRoute<TaskBoardRouteProp>()
  const { isDarkMode } = useSettingsStore()
  const { tasks, updateTaskStatus } = useTaskStore()

  const { projectId } = route.params
  const filteredTasks = tasks.filter((t) => t.projectId === projectId)

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo')
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'inprogress')
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed')

  const handleTaskAction = (task: Task) => {
    const nextOptions = []
    if (task.status !== 'todo') {
      nextOptions.push({ text: "Move to To Do", onPress: () => updateTaskStatus(task.id, 'todo') })
    }
    if (task.status !== 'inprogress') {
      nextOptions.push({ text: "Move to In Progress", onPress: () => updateTaskStatus(task.id, 'inprogress') })
    }
    if (task.status !== 'completed') {
      nextOptions.push({ text: "Move to Completed", onPress: () => updateTaskStatus(task.id, 'completed') })
    }
    
    Alert.alert(
      "Update Task Status",
      `Task: ${task.title}\nCurrent Status: ${task.status}`,
      [
        { text: "Cancel", style: "cancel" },
        ...nextOptions
      ]
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  const renderColumn = (title: string, list: Task[]) => (
    <View style={styles.column}>
      <Text style={[styles.columnHeader, textStyle]}>{title} ({list.length})</Text>
      {list.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.taskCard, cardStyle]}
          onPress={() => handleTaskAction(item)}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.taskTitle, textStyle]}>{item.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'critical' ? '#EF4444' : '#3B82F6' }]}>
              <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.taskDesc, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            {item.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <ScrollView style={[styles.container, bgStyle]} horizontal contentContainerStyle={styles.boardContent}>
      {renderColumn("TO DO", todoTasks)}
      {renderColumn("IN PROGRESS", inProgressTasks)}
      {renderColumn("COMPLETED", completedTasks)}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  boardContent: {
    padding: 15,
  },
  column: {
    width: 280,
    marginRight: 20,
  },
  columnHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskCard: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: 160,
    lineHeight: 18,
  },
  taskDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  }
})
