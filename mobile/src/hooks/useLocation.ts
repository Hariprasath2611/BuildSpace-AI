import { useState, useEffect } from 'react'

interface Coords {
  latitude: number
  longitude: number
  accuracy: number | null
}

export const useLocation = () => {
  const [coords, setCoords] = useState<Coords>({
    latitude: 12.9716, // Default Bangalore coords
    longitude: 77.5946,
    accuracy: 10
  })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    // Simulated GPS walking/movement updates
    const interval = setInterval(() => {
      setCoords((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0002,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0002,
        accuracy: 5 + Math.floor(Math.random() * 5)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    return true
  }

  return { coords, errorMsg, requestPermission }
}
