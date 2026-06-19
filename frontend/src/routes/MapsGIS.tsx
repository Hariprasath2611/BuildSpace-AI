import React, { useState } from 'react'
import {
  Map,
  Compass,
  Layers,
  Search,
  Filter,
  Navigation,
  Wind,
  Truck,
  Activity,
  Plus,
  Trash2,
  Sliders,
  Maximize2
} from 'lucide-react'
import { useMapStore, type TrackedEntity } from '@/store/mapStore'

export default function MapsGIS() {
  const trackedEntities = useMapStore((state) => state.trackedEntities)
  const geofenceZones = useMapStore((state) => state.geofenceZones)
  const isSatelliteView = useMapStore((state) => state.isSatelliteView)
  const isTrafficLayerActive = useMapStore((state) => state.isTrafficLayerActive)
  const isWeatherOverlayActive = useMapStore((state) => state.isWeatherOverlayActive)
  
  const toggleSatelliteView = useMapStore((state) => state.toggleSatelliteView)
  const toggleTrafficLayer = useMapStore((state) => state.toggleTrafficLayer)
  const toggleWeatherOverlay = useMapStore((state) => state.toggleWeatherOverlay)
  const addGeofenceZone = useMapStore((state) => state.addGeofenceZone)

  // Local Search & measuring states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'All' | 'Worker' | 'Equipment' | 'Vehicle' | 'Delivery'>('All')

  // Distance measuring points state
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([])

  // Geofence drawer form state
  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneType, setNewZoneType] = useState<'Safe' | 'Restricted' | 'Hazard'>('Safe')
  const [isDrawingGeofence, setIsDrawingGeofence] = useState(false)
  const [drawCoords, setDrawCoords] = useState<{ lat: number; lng: number }[]>([])

  // Click on map simulation handler
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    // Convert pixel to simulated lat/lng coordinates (centered around San Jose)
    const lat = 37.3382 + (200 - y) * 0.00005
    const lng = -121.8863 + (x - 300) * 0.00005

    if (isDrawingGeofence) {
      setDrawCoords([...drawCoords, { lat, lng }])
    } else {
      // Measuring tool
      if (measurePoints.length >= 2) {
        setMeasurePoints([{ x, y }])
      } else {
        setMeasurePoints([...measurePoints, { x, y }])
      }
    }
  }

  const handleSaveGeofence = () => {
    if (!newZoneName || drawCoords.length < 3) return
    addGeofenceZone({
      name: newZoneName,
      type: newZoneType,
      coordinates: drawCoords
    })
    setNewZoneName('')
    setDrawCoords([])
    setIsDrawingGeofence(false)
  }

  // Calculated distance between points
  const calculatedDistance = () => {
    if (measurePoints.length < 2) return null
    const [p1, p2] = measurePoints
    const distPx = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    const distMeters = Math.round(distPx * 1.8) // Simulated scale: 1px = 1.8m
    return distMeters
  }

  const filteredEntities = trackedEntities.filter((ent) => {
    const matchSearch = ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (ent.operatorName && ent.operatorName.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchCategory = activeCategory === 'All' || ent.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight">Maps & GIS Command</h1>
        <p className="text-xs text-muted-foreground">Manage real-time telemetry coordinates, geofences limits, traffic layers, and drone survey points.</p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar settings and search */}
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
            <h3 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" /> Map Overlays
            </h3>
            
            <div className="space-y-2 text-xs">
              <button
                onClick={toggleSatelliteView}
                className={`w-full p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  isSatelliteView ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-border hover:bg-muted'
                }`}
              >
                🛰️ Satellite Orthophoto: {isSatelliteView ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={toggleTrafficLayer}
                className={`w-full p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  isTrafficLayerActive ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-border hover:bg-muted'
                }`}
              >
                🚗 Live Traffic Layer: {isTrafficLayerActive ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={toggleWeatherOverlay}
                className={`w-full p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  isWeatherOverlayActive ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-border hover:bg-muted'
                }`}
              >
                🌧️ Doppler Weather Radar: {isWeatherOverlayActive ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Measuring Tools / Distance */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-3.5 text-xs">
            <h3 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-500" /> Distance Measuring
            </h3>
            <p className="text-[11px] text-muted-foreground">Click two locations on the GIS layout grid to calculate the structural distance clearance.</p>
            
            {measurePoints.length > 0 && (
              <div className="p-3 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span>Points log:</span>
                  <span className="text-slate-500">{measurePoints.length} set</span>
                </div>
                {calculatedDistance() && (
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100">
                    <span>Clearance:</span>
                    <span className="text-amber-500">{calculatedDistance()} meters</span>
                  </div>
                )}
                <button
                  onClick={() => setMeasurePoints([])}
                  className="w-full mt-2 py-1.5 bg-slate-850 hover:bg-slate-800 text-white rounded text-[10px] font-bold"
                >
                  Clear Points
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GIS Canvas Screen */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search crew or vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap gap-1 bg-muted/30 p-1 border border-border rounded-xl">
              {(['All', 'Worker', 'Equipment', 'Vehicle', 'Delivery'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeCategory === cat ? 'bg-amber-500 text-slate-950' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive GIS canvas map */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-3xl p-3 shadow-floating text-xs">
            <div
              onClick={handleMapClick}
              className={`w-full h-112 rounded-2xl relative overflow-hidden border border-border flex items-center justify-center cursor-crosshair ${
                isSatelliteView ? 'bg-slate-950' : 'bg-slate-900/10 dark:bg-slate-950/20'
              }`}
            >
              {/* Simulated Map Background */}
              <svg className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-800" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gis-grid)" />
                
                {/* Simulated river / roads */}
                <path d="M-50,220 C200,250 450,180 900,240" fill="none" stroke={isSatelliteView ? '#1e293b' : '#38bdf8'} strokeWidth="16" opacity="0.4" />
                <path d="M300,-50 L300,500" fill="none" stroke={isSatelliteView ? '#334155' : '#e2e8f0'} strokeWidth="8" opacity="0.3" />
                <path d="M-50,110 L900,110" fill="none" stroke={isSatelliteView ? '#334155' : '#e2e8f0'} strokeWidth="8" opacity="0.3" />
              </svg>

              {/* Weather Cloud Overlay */}
              {isWeatherOverlayActive && (
                <div className="absolute inset-0 bg-sky-400/5 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full text-blue-500 opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="180" r="120" fill="currentColor" filter="blur(20px)" />
                    <circle cx="500" cy="150" r="90" fill="currentColor" filter="blur(15px)" />
                  </svg>
                  <div className="absolute top-4 left-4 bg-sky-950/80 text-sky-200 text-[10px] p-2 rounded-lg border border-sky-800 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 animate-spin-slow" /> Weather Radar: Light rain showers active.
                  </div>
                </div>
              )}

              {/* Traffic Flow Line Overlay */}
              {isTrafficLayerActive && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M300,-50 L300,500" fill="none" stroke="#22c55e" strokeWidth="4" opacity="0.6" />
                  <path d="M-50,110 L900,110" fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.6" />
                </svg>
              )}

              {/* Geofence zones */}
              {geofenceZones.map((zone) => {
                // Plot simulated geofences relative to canvas width/height
                const points = zone.name.includes("Excavation") 
                  ? "80,180 250,120 400,220 180,310" 
                  : "300,80 480,100 450,220 280,185"
                const strokeColor = zone.type === 'Restricted' ? '#f43f5e' : zone.type === 'Hazard' ? '#f59e0b' : '#10b981'
                const fillColor = zone.type === 'Restricted' ? 'rgba(244, 63, 94, 0.05)' : zone.type === 'Hazard' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)'
                return (
                  <svg key={zone.id} className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points={points} fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3,3" />
                  </svg>
                )
              })}

              {/* Tracked crew points */}
              {filteredEntities.map((ent, i) => {
                // Map latitude/longitude to grid pixels
                const x = 300 + (ent.lng - (-121.8863)) * 20000
                const y = 200 - (ent.lat - 37.3382) * 20000
                return (
                  <div
                    key={ent.id}
                    className="absolute group"
                    style={{ left: `${x}px`, top: `${y}px` }}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white border border-white cursor-pointer ${
                      ent.category === 'Equipment' ? 'bg-amber-500 animate-pulse' :
                      ent.category === 'Delivery' ? 'bg-blue-500' :
                      'bg-emerald-500'
                    }`}>
                      <Navigation className="w-2.5 h-2.5" />
                    </div>
                    {/* Tooltip detail card */}
                    <div className="hidden group-hover:block absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] p-2.5 rounded-xl border border-border shadow-2xl z-20 w-44 space-y-1">
                      <span className="font-bold block leading-tight">{ent.name}</span>
                      <span className="text-slate-400 block">{ent.category} • Status: {ent.status}</span>
                      {ent.operatorName && <span className="text-slate-400 block">Operator: {ent.operatorName}</span>}
                      {ent.speed && <span className="text-slate-400 block">Speed: {ent.speed} mph</span>}
                    </div>
                  </div>
                )
              })}

              {/* Measurement Line Overlay */}
              {measurePoints.length === 2 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <line
                    x1={measurePoints[0].x}
                    y1={measurePoints[0].y}
                    x2={measurePoints[1].x}
                    y2={measurePoints[1].y}
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  <circle cx={measurePoints[0].x} cy={measurePoints[0].y} r="4" fill="#f59e0b" />
                  <circle cx={measurePoints[1].x} cy={measurePoints[1].y} r="4" fill="#f59e0b" />
                </svg>
              )}

              {/* Geofence drawing coordinates dots overlay */}
              {isDrawingGeofence && drawCoords.map((coord, i) => {
                const x = 300 + (coord.lng - (-121.8863)) * 20000
                const y = 200 - (coord.lat - 37.3382) * 20000
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-amber-500 border border-white"
                    style={{ left: `${x}px`, top: `${y}px` }}
                  ></div>
                )
              })}

              {/* Map Footer status */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 text-white text-[10px] p-2.5 rounded-xl border border-border space-y-1">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Live Crew (Inside geofence)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Heavy Machinery telemetry</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Dispatch Trucks route</div>
              </div>
            </div>

            {/* Geofence drawer panel */}
            <div className="mt-4 p-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDrawingGeofence(!isDrawingGeofence)
                    setDrawCoords([])
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold ${
                    isDrawingGeofence ? 'bg-amber-500 text-slate-950' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {isDrawingGeofence ? 'Stop Drawing Zone' : 'Create Geofence Zone'}
                </button>
                {isDrawingGeofence && <span className="text-muted-foreground animate-pulse">{drawCoords.length} points set. Click on map to plot bounds.</span>}
              </div>

              {isDrawingGeofence && drawCoords.length >= 3 && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Zone Name"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    className="bg-muted border border-border rounded p-1 text-xs"
                  />
                  <select
                    value={newZoneType}
                    onChange={(e) => setNewZoneType(e.target.value as any)}
                    className="bg-muted border border-border rounded p-1 text-xs"
                  >
                    <option value="Safe">Safe</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Hazard">Hazard</option>
                  </select>
                  <button onClick={handleSaveGeofence} className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">
                    Save Zone
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
