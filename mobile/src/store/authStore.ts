import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface User {
  userId: string
  userName: string
  role: string
  tenantId: string
  companyId: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isBiometricsEnabled: boolean
  isLoading: boolean
  login: (username: string, tenantId: string, role?: string) => Promise<boolean>
  logout: () => Promise<void>
  setBiometrics: (enabled: boolean) => Promise<void>
  loadStoredSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isBiometricsEnabled: false,
  isLoading: true,

  login: async (username, tenantId, role = 'General Contractor') => {
    set({ isLoading: true })
    try {
      const mockUser: User = {
        userId: `usr_${Date.now()}`,
        userName: username || 'Guest PM',
        role,
        tenantId: tenantId || 'tenant_default_99',
        companyId: 'company_apex_solutions'
      }
      const mockToken = `jwt-mobile-token-${Date.now()}`

      await AsyncStorage.setItem('BS_TOKEN', mockToken)
      await AsyncStorage.setItem('BS_USER', JSON.stringify(mockUser))

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false
      })
      return true
    } catch (e) {
      set({ isLoading: false })
      return false
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('BS_TOKEN')
    await AsyncStorage.removeItem('BS_USER')
    set({
      user: null,
      token: null,
      isAuthenticated: false
    })
  },

  setBiometrics: async (enabled) => {
    await AsyncStorage.setItem('BS_BIOMETRICS', enabled ? 'true' : 'false')
    set({ isBiometricsEnabled: enabled })
  },

  loadStoredSession: async () => {
    try {
      const token = await AsyncStorage.getItem('BS_TOKEN')
      const userStr = await AsyncStorage.getItem('BS_USER')
      const bioStr = await AsyncStorage.getItem('BS_BIOMETRICS')

      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isAuthenticated: true
        })
      }
      set({
        isBiometricsEnabled: bioStr === 'true',
        isLoading: false
      })
    } catch (e) {
      set({ isLoading: false })
    }
  }
}))
