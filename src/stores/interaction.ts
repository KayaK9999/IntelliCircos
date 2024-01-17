import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFigureStore } from './figure'
import type { Track } from '@/lib/circos'

interface GuideLine {
  x1: number
  y1: number
  x2: number
  y2: number
  show: boolean
  id: string
}

let id = 0

export const useInteractionStore = defineStore('interaction', () => {
  const figureStore = useFigureStore()
  const activeTracks = ref<Track[]>([])
  const setActiveTrackId = (id: string) => {
    const track = figureStore.tracks.find(item => id === item.id)
    if (track) {
      activeTracks.value = [track]
    }
  }
  const removeActiveTrackId = (id: string) => {
    const index = activeTracks.value.findIndex(item => id === item.id)
    if (index > -1) {
      activeTracks.value.splice(index, 1)
    }
  }

  const lines = ref<GuideLine[]>([])
  const addGuideLine = (line: GuideLine) => {
    lines.value.push(line)
  }

  const removeGuideLine = (id: string) => {
    const index = lines.value.findIndex(item => item.id === id)
    if (index > -1) {
      lines.value.splice(index, 1)
    }
  }

  const addGuideLineFromElement = (left_element: HTMLElement, right_element: HTMLElement) => {
    console.log(left_element, right_element)
    const left_rect = left_element.getBoundingClientRect()
    const right_rect = right_element.getBoundingClientRect()
    const line = {
      x1: left_rect.right,
      y1: left_rect.top + left_rect.height / 2,
      x2: right_rect.left,
      y2: right_rect.top + right_rect.height / 2,
      show: true,
      id: `${++id}`
    }
    addGuideLine(line)
    return String(id)
  }



  return { activeTracks, setActiveTrackId, removeActiveTrackId, addGuideLine, removeGuideLine, addGuideLineFromElement, lines }
})