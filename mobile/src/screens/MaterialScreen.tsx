import React, { useState } from 'react'
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native'
import { useMaterialStore, MaterialItem, MaterialRequest } from '../store/materialStore'
import { useSettingsStore } from '../store/settingsStore'

export default function MaterialScreen() {
  const { isDarkMode } = useSettingsStore()
  const { materials, requests, requestMaterial, auditMaterialStock } = useMaterialStore()

  const [reqName, setReqName] = useState('')
  const [reqQty, setReqQty] = useState('')
  const [reqUnit, setReqUnit] = useState('bags')

  const handleRequestMaterial = () => {
    if (!reqName || !reqQty) {
      Alert.alert("Validation Error", "Please provide material name and quantity.")
      return
    }
    requestMaterial(reqName, parseFloat(reqQty), reqUnit)
    setReqName('')
    setReqQty('')
    Alert.alert("Request Submitted", "Material request queued for supervisor approval.")
  }

  const handleBarcodeScan = () => {
    // Simulated barcode scan checking cement sku CMT-43N
    Alert.alert(
      "Barcode Scanned",
      "SKU: CMT-43N (OPC Cement)\nCurrent Stock: 450 bags\n\nWould you like to log an audit update?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "SET STOCK TO 440", onPress: () => {
          auditMaterialStock("CMT-43N", 440)
          Alert.alert("Audit Logged", "Grade 43 OPC Cement stock set to 440 bags.")
        }}
      ]
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  const renderMaterialItem = ({ item }: { item: MaterialItem }) => (
    <View style={[styles.itemCard, cardStyle]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemName, textStyle]}>{item.name}</Text>
        <Text style={[styles.itemStock, { color: item.status === 'Reorder' ? '#EF4444' : '#10B981' }]}>
          {item.currentStock} {item.unit}
        </Text>
      </View>
      <Text style={[styles.itemSku, isDark ? styles.textMutedDark : styles.textMutedLight]}>
        SKU: {item.sku} • Category: {item.category} • Status: {item.status}
      </Text>
    </View>
  )

  const renderRequestItem = ({ item }: { item: MaterialRequest }) => (
    <View style={[styles.reqCard, cardStyle]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.reqName, textStyle]}>{item.materialName}</Text>
        <View style={[styles.badge, item.status === 'Approved' ? styles.badgeApp : styles.badgePend]}>
          <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={[styles.reqQty, isDark ? styles.textMutedDark : styles.textMutedLight]}>
        Requested Volume: {item.quantity} {item.unit}
      </Text>
    </View>
  )

  return (
    <ScrollView style={[styles.container, bgStyle]} contentContainerStyle={styles.content}>
      {/* Scanner trigger */}
      <TouchableOpacity style={styles.scanBtn} onPress={handleBarcodeScan}>
        <Text style={styles.scanBtnText}>🏷️ LAUNCH BARCODE / QR SCANNER</Text>
      </TouchableOpacity>

      {/* Request Form */}
      <View style={[styles.formCard, cardStyle]}>
        <Text style={[styles.formTitle, textStyle]}>Request Purchase Dispatch</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Material name (e.g. Steel Rebar)"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={reqName}
          onChangeText={setReqName}
        />
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Quantity (e.g. 15)"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={reqQty}
          onChangeText={setReqQty}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Unit (e.g. tons, bags, pcs)"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={reqUnit}
          onChangeText={setReqUnit}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleRequestMaterial}>
          <Text style={styles.submitBtnText}>SUBMIT REQUEST</Text>
        </TouchableOpacity>
      </View>

      {/* Materials grid */}
      <Text style={[styles.sectionTitle, textStyle]}>Warehouse Materials Status</Text>
      <FlatList
        data={materials}
        keyExtractor={(item) => item.id}
        renderItem={renderMaterialItem}
        scrollEnabled={false}
      />

      {/* Requests */}
      <Text style={[styles.sectionTitle, textStyle]}>Recent Dispatches & Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        scrollEnabled={false}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textMutedLight: { color: '#64748B' },
  textMutedDark: { color: '#94A3B8' },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  scanBtn: {
    backgroundColor: '#3B82F6',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  formCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 14,
  },
  inputLight: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  inputDark: {
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemStock: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemSku: {
    fontSize: 11,
  },
  reqCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  reqName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  reqQty: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeApp: { backgroundColor: '#10B981' },
  badgePend: { backgroundColor: '#F59E0B' },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' }
})
