import { defineStore } from 'pinia'

export const useEditerStore = defineStore('editor', {
  state: () => {
    const canvas = document.createElement('canvas')
    return {
      canvas,
      g2d: canvas.getContext('2d') as CanvasRenderingContext2D,
      updatedAt: Date.now(),
      size: 32,
      scale: 2,

      direction: 'left',
      action: 'walk',
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
