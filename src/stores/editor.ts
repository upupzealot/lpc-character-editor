import { defineStore } from 'pinia'
import { Texture } from 'pixi.js'

export const useEditerStore = defineStore('editor', {
  state: () => {
    const canvas = document.createElement('canvas')
    canvas.style.imageRendering = 'pixelated'
    document.body.prepend(canvas)
    const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
    const texture = Texture.from(canvas)
    return {
      composite: {
        canvas: () => {
          return canvas
        },
        g2d: () => {
          return g2d
        },
        texture: () => {
          return texture
        },
      },

      updatedAt: Date.now(),

      size: 32,
      scale: 2,

      direction: 'left',
      action: 'walk',

      selection: {
        body: 'body-1',
        hair: 'hair-1',
      },
    }
  },
})
