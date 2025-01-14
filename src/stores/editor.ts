import { defineStore } from 'pinia'

export const useEditerStore = defineStore('editor', {
  state: () => {
    const canvas = document.createElement('canvas')
    return {
      direction: 'left',
      size: 32,
      scale: 2,
      canvas,
      g2d: canvas.getContext('2d') as CanvasRenderingContext2D,
      updatedAt: Date.now(),
    }
  },
  actions: {
    selectDirection(direction: string) {
      this.direction = direction
    },
    updateCanvas() {
      this.updatedAt = Date.now()
    },
  },
})
