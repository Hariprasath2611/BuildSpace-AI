import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useSettingsStore } from '../store/settingsStore'

export default function FinanceScreen() {
  const { isDarkMode } = useSettingsStore()

  const handleApproveInvoice = (invoiceId: string) => {
    Alert.alert(
      "Approve Invoice",
      `Are you sure you want to sign off and approve payment for invoice ${invoiceId}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "APPROVE", onPress: () => Alert.alert("Invoice Approved", `Invoice ${invoiceId} marked as ready-for-disbursement.`) }
      ]
    )
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <ScrollView style={[styles.container, bgStyle]} contentContainerStyle={styles.content}>
      {/* Overview */}
      <View style={[styles.overviewCard, cardStyle]}>
        <Text style={[styles.cardTitle, textStyle]}>Budget & Cash Flow Status</Text>
        <Text style={[styles.amountText, { color: '#EF4444' }]}>$124,500.00 spent</Text>
        <Text style={[styles.spentSub, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Allocated Budget: $150,000.00 (83% utilized)
        </Text>
      </View>

      {/* Approvals */}
      <Text style={[styles.sectionTitle, textStyle]}>Pending Approvals</Text>
      
      <View style={[styles.invoiceCard, cardStyle]}>
        <View style={styles.invoiceHeader}>
          <Text style={[styles.vendor, textStyle]}>Apex Concrete Solutions</Text>
          <Text style={[styles.invAmount, textStyle]}>$14,250.00</Text>
        </View>
        <Text style={[styles.invDesc, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Deliveries for Building A foundations (Floor 2 slab).
        </Text>
        <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproveInvoice("AC-98721")}>
          <Text style={styles.approveBtnText}>APPROVE PAYMENT</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.invoiceCard, cardStyle]}>
        <View style={styles.invoiceHeader}>
          <Text style={[styles.vendor, textStyle]}>Titan Steel Industries</Text>
          <Text style={[styles.invAmount, textStyle]}>$2,800.00</Text>
        </View>
        <Text style={[styles.invDesc, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          3.5 Tons Structural Steel Rebars delivery.
        </Text>
        <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproveInvoice("TS-88710")}>
          <Text style={styles.approveBtnText}>APPROVE PAYMENT</Text>
        </TouchableOpacity>
      </View>
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
  overviewCard: {
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  spentSub: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  invoiceCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vendor: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  invAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  invDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 15,
  },
  approveBtn: {
    backgroundColor: '#3B82F6',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  }
})
