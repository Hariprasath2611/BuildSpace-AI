import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'

// Screen imports
import LoginScreen from '../screens/LoginScreen'
import DashboardScreen from '../screens/DashboardScreen'
import ProjectsScreen from '../screens/ProjectsScreen'
import AttendanceScreen from '../screens/AttendanceScreen'
import AICopilotScreen from '../screens/AICopilotScreen'
import SafetyScreen from '../screens/SafetyScreen'
import ProgressScreen from '../screens/ProgressScreen'
import MaterialScreen from '../screens/MaterialScreen'
import FinanceScreen from '../screens/FinanceScreen'
import DocumentScreen from '../screens/DocumentScreen'
import TaskBoardScreen from '../screens/TaskBoardScreen'
import ChatScreen from '../screens/ChatScreen'
import MapScreen from '../screens/MapScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'

import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types'

const Stack = createStackNavigator<RootStackParamList>()
const AuthStack = createStackNavigator<AuthStackParamList>()
const Tab = createBottomTabNavigator<MainTabParamList>()

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  )
}

function MainTabNavigator() {
  const { isDarkMode } = useSettingsStore()
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
        },
        headerTintColor: isDarkMode ? '#F8FAFC' : '#0F172A',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#334155' : '#E2E8F0',
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: isDarkMode ? '#94A3B8' : '#64748B',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="AICopilot" component={AICopilotScreen} options={{ title: 'AI Assistant' }} />
      <Tab.Screen name="Safety" component={SafetyScreen} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore()
  const { isDarkMode } = useSettingsStore()

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          },
          headerTintColor: isDarkMode ? '#F8FAFC' : '#0F172A',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Project Details' }} />
            <Stack.Screen name="TaskBoard" component={TaskBoardScreen} options={{ title: 'Task Board' }} />
            <Stack.Screen name="ProgressUpload" component={ProgressScreen} options={{ title: 'Progress Upload' }} />
            <Stack.Screen name="Materials" component={MaterialScreen} options={{ title: 'Material Manager' }} />
            <Stack.Screen name="Finance" component={FinanceScreen} options={{ title: 'Finance Center' }} />
            <Stack.Screen name="Documents" component={DocumentScreen} options={{ title: 'Blueprints & PDFs' }} />
            <Stack.Screen name="ChatRoom" component={ChatScreen} options={({ route }) => ({ title: route.params?.title || 'Chat' })} />
            <Stack.Screen name="MapTracking" component={MapScreen} options={{ title: 'Site GPS Map' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'App Settings' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
