import { useState } from 'react'

export const useSpeech = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")

  const startSpeechRecording = async () => {
    setIsRecording(true)
    setTranscript("")
    
    // Simulate speech-to-text token transcription
    setTimeout(() => {
      setTranscript("Create a safety hazard log for Sector C scaffolding.")
    }, 1500)
    
    setTimeout(() => {
      setIsRecording(false)
    }, 2500)
  }

  const stopSpeechRecording = () => {
    setIsRecording(false)
  }

  return { isRecording, transcript, startSpeechRecording, stopSpeechRecording }
}
export default useSpeech
