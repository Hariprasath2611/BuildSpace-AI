import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider } from 'react-native-paper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppNavigator from './src/navigation/AppNavigator'
import { useAuthStore } from './src/store/authStore'
import { useSettingsStore } from './src/store/settingsStore'

const queryClient = new QueryClient()

export default function App() {
  const { loadStoredSession } = useAuthStore()
  const { isDarkMode } = useSettingsStore()

  useEffect(() => {
    // Load local AsyncStorage user session on boot
    loadStoredSession()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <AppNavigator />
      </PaperProvider>
    </QueryClientProvider>
  )
}
