import { create } from 'zustand'

export interface TrackedEntity {
  id: string
  name: string
  category: 'Worker' | 'Equipment' | 'Vehicle' | 'Delivery'
  lat: number
  lng: number
  status: string
  operatorName?: string
  speed?: number // mph
}

export interface GeofenceZone {
  id: string
  name: string
  type: 'Safe' | 'Restricted' | 'Hazard'
  coordinates: { lat: number; lng: number }[]
}

export interface MapState {
  trackedEntities: TrackedEntity[]
  geofenceZones: GeofenceZone[]
  isSatelliteView: boolean
  isTrafficLayerActive: boolean
  isWeatherOverlayActive: boolean
  updateEntityPosition: (id: string, lat: number, lng: number, status?: string) => void
  toggleSatelliteView: () => void
  toggleTrafficLayer: () => void
  toggleWeatherOverlay: () => void
  addGeofenceZone: (zone: Omit<GeofenceZone, 'id'>) => void
}

const DEFAULT_ENTITIES: TrackedEntity[] = [
  { id: "ent-1", name: "Apex Earthworks Excavator", category: "Equipment", lat: 37.3382, lng: -121.8863, status: "Active", operatorName: "Marcus Vance" },
  { id: "ent-2", name: "Liebherr Mobile Crane", category: "Equipment", lat: 37.3391, lng: -121.8854, status: "Idle", operatorName: "Sarah Connor" },
  { id: "ent-3", name: "Truck 08 (Concrete Delivery)", category: "Delivery", lat: 37.3402, lng: -121.8885, status: "En Route", speed: 35 },
  { id: "ent-4", name: "Steel Hauler Shipment", category: "Delivery", lat: 37.3355, lng: -121.8833, status: "Delayed", speed: 0 }
]

const DEFAULT_GEOFENCES: GeofenceZone[] = [
  {
    id: "geo-1",
    name: "Main Excavation Footprint",
    type: "Safe",
    coordinates: [
      { lat: 37.3375, lng: -121.8875 },
      { lat: 37.3395, lng: -121.8875 },
      { lat: 37.3395, lng: -121.8845 },
      { lat: 37.3375, lng: -121.8845 }
    ]
  },
  {
    id: "geo-2",
    name: "Power Transformer Vault",
    type: "Restricted",
    coordinates: [
      { lat: 37.3388, lng: -121.8858 },
      { lat: 37.3393, lng: -121.8858 },
      { lat: 37.3393, lng: -121.8853 },
      { lat: 37.3388, lng: -121.8853 }
    ]
  }
]

export const useMapStore = create<MapState>((set) => ({
  trackedEntities: DEFAULT_ENTITIES,
  geofenceZones: DEFAULT_GEOFENCES,
  isSatelliteView: false,
  isTrafficLayerActive: false,
  isWeatherOverlayActive: false,
  updateEntityPosition: (id, lat, lng, status) => set((state) => ({
    trackedEntities: state.trackedEntities.map((ent) =>
      ent.id === id ? { ...ent, lat, lng, ...(status && { status }) } : ent
    )
  })),
  toggleSatelliteView: () => set((state) => ({ isSatelliteView: !state.isSatelliteView })),
  toggleTrafficLayer: () => set((state) => ({ isTrafficLayerActive: !state.isTrafficLayerActive })),
  toggleWeatherOverlay: () => set((state) => ({ isWeatherOverlayActive: !state.isWeatherOverlayActive })),
  addGeofenceZone: (zone) => set((state) => ({
    geofenceZones: [...state.geofenceZones, { ...zone, id: `geo-${Date.now()}` }]
  }))
}))

export default useMapStore
