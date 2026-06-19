import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { biometricService } from '../services/biometrics'

export default function LoginScreen() {
  const { isDarkMode } = useSettingsStore()
  const { login, loadStoredSession, isBiometricsEnabled, setBiometrics } = useAuthStore()
  
  const [username, setUsername] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    loadStoredSession()
  }, [])

  const handleLogin = async () => {
    if (!username || !tenantId) {
      Alert.alert("Validation Error", "Please provide both username and Tenant ID.")
      return
    }
    setIsLoggingIn(true)
    const success = await login(username, tenantId)
    setIsLoggingIn(false)
    if (!success) {
      Alert.alert("Login Failed", "Could not authorize credentials.")
    }
  }

  const handleBiometricLogin = async () => {
    const success = await biometricService.authenticate()
    if (success) {
      await login("Biometric User", "tenant_default_99")
    } else {
      Alert.alert("Biometrics Failed", "Authentication rejected by hardware scanner.")
    }
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight

  return (
    <View style={[styles.container, bgStyle]}>
      <Text style={[styles.title, textStyle]}>BuildSpace AI</Text>
      <Text style={[styles.subtitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
        Enterprise Construction OS
      </Text>

      <View style={styles.form}>
        <Text style={[styles.label, textStyle]}>Tenant Organization ID</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="tenant_default_99"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={tenantId}
          onChangeText={setTenantId}
          autoCapitalize="none"
        />

        <Text style={[styles.label, textStyle]}>Username</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="john.doe"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={[styles.label, textStyle]}>Password</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="••••••••"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={isLoggingIn}>
          {isLoggingIn ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>Authenticate Session</Text>
          )}
        </TouchableOpacity>

        {isBiometricsEnabled && (
          <TouchableOpacity style={styles.btnBio} onPress={handleBiometricLogin}>
            <Text style={styles.btnBioText}>Login with Face ID / Touch ID</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  inputLight: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  inputDark: {
    borderColor: '#334155',
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
  },
  btn: {
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnBio: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  btnBioText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: 'bold',
  }
})
