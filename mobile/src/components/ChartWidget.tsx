import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

interface Props {
  data: Array<{ label: string; value: number }>
}

export default function ChartWidget({ data }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>[Victory Native Cost Forecast Chart]</Text>
      {data.map((item, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.label}>{item.label}:</Text>
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${Math.min(100, item.value / 1500)}%` }]} />
          </View>
          <Text style={styles.val}>${item.value}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    width: '100%',
    marginVertical: 15,
  },
  header: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#64748B',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 60,
    fontSize: 11,
    fontWeight: '600',
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  val: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  }
})
