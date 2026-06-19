class BiometricService {
  public async isHardwareAvailable(): Promise<boolean> {
    // In production, import expo-local-authentication or react-native-fingerprint-scanner.
    // Falls back to mock validation if running in developer sandbox.
    return true
  }

  public async authenticate(reason: string = "Scan biometrics to log in to BuildSpace AI"): Promise<boolean> {
    console.log(`Triggered biometric authentication for: '${reason}'`)
    // Emulates successful hardware scan
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 800)
    })
  }
}

export const biometricService = new BiometricService()
