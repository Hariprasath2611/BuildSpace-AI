import React, { useState } from 'react'
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useAIStore, Message } from '../store/aiStore'
import { useSettingsStore } from '../store/settingsStore'
import { useSpeech } from '../hooks/useSpeech'

export default function AICopilotScreen() {
  const { isDarkMode } = useSettingsStore()
  const { activePersona, setPersona, messages, isTyping, sendMessage } = useAIStore()
  const { isRecording, transcript, startSpeechRecording } = useSpeech()

  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    const textToSend = input
    setInput('')
    await sendMessage(textToSend)
  }

  const handleVoicePress = async () => {
    await startSpeechRecording()
    // In useEffect, if transcript changes we send it
  }

  // React to voice transcripts
  React.useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <View style={[styles.container, bgStyle]}>
      {/* Persona filters */}
      <View style={styles.tabRow}>
        {(['Project', 'Material', 'Safety', 'Meeting'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.tab, activePersona === p ? styles.tabActive : null]}
            onPress={() => setPersona(p)}
          >
            <Text style={[styles.tabText, activePersona === p ? styles.tabTextActive : textStyle]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message list */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatScroll}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === 'user' ? styles.bubbleUser : [styles.bubbleAssistant, cardStyle]
            ]}
          >
            <Text style={[styles.bubbleText, m.role === 'user' ? styles.textWhite : textStyle]}>
              {m.content}
            </Text>
            {m.references && m.references.length > 0 && (
              <View style={styles.refRow}>
                <Text style={styles.refTitle}>Citations:</Text>
                {m.references.map((r, i) => (
                  <Text key={i} style={styles.refText}>• {r}</Text>
                ))}
              </View>
            )}
            <Text style={m.role === 'user' ? styles.timeUser : styles.timeAssistant}>
              {m.timestamp}
            </Text>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.bubble, styles.bubbleAssistant, cardStyle, styles.typingRow]}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={[styles.typingText, textStyle]}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Inputs */}
      <View style={[styles.inputRow, isDark ? styles.inputRowDark : styles.inputRowLight]}>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder={`Ask the ${activePersona} assistant...`}
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.voiceBtn} onPress={handleVoicePress} disabled={isRecording}>
          <Text style={styles.voiceBtnText}>{isRecording ? "🎤" : "🎙️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: { backgroundColor: '#F8FAFC' },
  bgDark: { backgroundColor: '#0F172A' },
  textLight: { color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  textWhite: { color: '#FFFFFF' },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  tabActive: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  chatArea: {
    flex: 1,
  },
  chatScroll: {
    padding: 15,
  },
  bubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeUser: {
    fontSize: 9,
    color: '#E2E8F0',
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  timeAssistant: {
    fontSize: 9,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 12,
    marginLeft: 8,
  },
  refRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#CBD5E1',
  },
  refTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 2,
  },
  refText: {
    fontSize: 10,
    color: '#64748B',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  inputRowLight: {
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  inputRowDark: {
    borderTopColor: '#334155',
    backgroundColor: '#1E293B',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 14,
    marginRight: 10,
  },
  inputLight: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
  },
  inputDark: {
    borderColor: '#475569',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
  },
  voiceBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  voiceBtnText: {
    fontSize: 18,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
})
