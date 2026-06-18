import { create } from 'zustand'

export interface UserProfile {
  uid: string
  email: string
  name: string
}

export interface AuthState {
  user: UserProfile | null
  token: string | null
  currentOrgId: string | null
  role: string | null
  isAuthenticated: boolean
  login: (user: UserProfile, token: string, role: string) => void
  logout: () => void
  selectOrg: (orgId: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  currentOrgId: null,
  role: null,
  isAuthenticated: false,
  login: (user, token, role) =>
    set({
      user,
      token,
      role,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      token: null,
      currentOrgId: null,
      role: null,
      isAuthenticated: false,
    }),
  selectOrg: (currentOrgId) => set({ currentOrgId }),
}))
