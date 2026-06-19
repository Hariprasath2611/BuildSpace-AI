import { create } from 'zustand'

export interface ImageAnnotation {
  id: string
  x: number
  y: number
  text: string
  severity: 'Low' | 'Medium' | 'High'
}

export interface MediaItem {
  id: string
  title: string
  category: 'Progress' | '360' | 'Drone' | 'Detail'
  url: string
  date: string
  tags: string[]
  annotations: ImageAnnotation[]
}

export interface MediaState {
  mediaItems: MediaItem[]
  activeMediaId: string | null
  addMediaItem: (item: Omit<MediaItem, 'id' | 'annotations'>) => void
  addMediaAnnotation: (itemId: string, annotation: Omit<ImageAnnotation, 'id'>) => void
  setActiveMedia: (id: string | null) => void
}

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: "med-1",
    title: "Slab Level 1 Foundation Pour Completed",
    category: "Progress",
    url: "/assets/hero.png", // fallback image url
    date: "2026-06-15",
    tags: ["Foundation", "Pour"],
    annotations: [
      { id: "an-1", x: 45, y: 60, text: "Structural core cylinder test location", severity: "Low" }
    ]
  },
  {
    id: "med-2",
    title: "Zone B North Exterior Columns View",
    category: "360",
    url: "/assets/hero.png",
    date: "2026-06-18",
    tags: ["Columns", "Zone B"],
    annotations: [
      { id: "an-2", x: 70, y: 30, text: "Verify rebar overlap spacing", severity: "High" }
    ]
  },
  {
    id: "med-3",
    title: "Project Perimeter drone scan v2",
    category: "Drone",
    url: "/assets/hero.png",
    date: "2026-06-12",
    tags: ["Perimeter", "Excavation"],
    annotations: []
  }
]

export const useMediaStore = create<MediaState>((set) => ({
  mediaItems: DEFAULT_MEDIA,
  activeMediaId: "med-1",
  addMediaItem: (item) => set((state) => ({
    mediaItems: [
      ...state.mediaItems,
      { ...item, id: `med-${Date.now()}`, annotations: [] }
    ]
  })),
  addMediaAnnotation: (itemId, annotation) => set((state) => ({
    mediaItems: state.mediaItems.map((m) =>
      m.id === itemId
        ? {
            ...m,
            annotations: [...m.annotations, { ...annotation, id: `an-${Date.now()}` }]
          }
        : m
    )
  })),
  setActiveMedia: (id) => set({ activeMediaId: id })
}))

export default useMediaStore
