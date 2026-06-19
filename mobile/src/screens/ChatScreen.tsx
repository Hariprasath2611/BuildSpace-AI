import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { socketService } from '../services/socket'
import { RootStackParamList } from '../navigation/types'

type ChatRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>

interface ChatMessage {
  id: string
  senderName: string
  text: string
  timestamp: string
  senderId: string
}

export default function ChatScreen() {
  const route = useRoute<ChatRouteProp>()
  const { isDarkMode } = useSettingsStore()
  const { user } = useAuthStore()

  const { channelId, title } = route.params
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "c_msg_1", senderId: "usr_system", senderName: "Operations Dispatcher", text: `Welcome to the ${title} channel. Realtime Socket.io active.`, timestamp: "10:00 AM" }
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Connect Socket.io client
    socketService.connect()
    
    // Subscribe to chat channels
    socketService.subscribeToEvent(`chat:${channelId}:message`, (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
      scrollRef.current?.scrollToEnd({ animated: true })
    })

    return () => {
      socketService.unsubscribeFromEvent(`chat:${channelId}:message`)
    }
  }, [channelId])

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.userId || 'usr_dev',
      senderName: user?.userName || 'Anonymous PM',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Emit message to Socket.io server
    socketService.emitEvent('send-message', {
      channelId,
      message: newMsg
    })

    // Local echo
    setMessages((prev) => [...prev, newMsg])
    setInput('')
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  const isDark = isDarkMode
  const bgStyle = isDark ? styles.bgDark : styles.bgLight
  const textStyle = isDark ? styles.textDark : styles.textLight
  const cardStyle = isDark ? styles.cardDark : styles.cardLight

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
      style={[styles.container, bgStyle]}
    >
      <ScrollView ref={scrollRef} style={styles.chatArea} contentContainerStyle={styles.chatScroll}>
        {messages.map((m) => {
          const isMe = m.senderId === user?.userId
          return (
            <View
              key={m.id}
              style={[
                styles.bubble,
                isMe ? styles.bubbleUser : [styles.bubbleOther, cardStyle]
              ]}
            >
              {!isMe && <Text style={styles.senderText}>{m.senderName}</Text>}
              <Text style={[styles.bubbleText, isMe ? styles.textWhite : textStyle]}>
                {m.text}
              </Text>
              <Text style={isMe ? styles.timeUser : styles.timeAssistant}>
                {m.timestamp}
              </Text>
            </View>
          )
        })}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputRow, isDark ? styles.inputRowDark : styles.inputRowLight]}>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="Send message..."
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>➔</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  chatArea: {
    flex: 1,
  },
  chatScroll: {
    padding: 15,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  senderText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeUser: {
    fontSize: 9,
    color: '#E2E8F0',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timeAssistant: {
    fontSize: 9,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginTop: 4,
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
