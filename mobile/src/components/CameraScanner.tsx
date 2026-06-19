import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

interface Props {
  onScan: (data: string) => void
  onClose: () => void
}

export default function CameraScanner({ onScan, onClose }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>[Vision Camera QR/Barcode Scanner]</Text>
      
      <TouchableOpacity style={styles.mockBtn} onPress={() => onScan("CMT-43N")}>
        <Text style={styles.btnText}>Simulate Scan SKU: CMT-43N</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.btnText}>Close Scanner</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  mockBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  closeBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
})
