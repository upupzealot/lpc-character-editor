import { defineStore } from 'pinia'
import { Texture, TextureSource } from 'pixi.js'

const canvas = document.createElement('canvas')
canvas.style.imageRendering = 'pixelated'
// document.body.prepend(canvas)
const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

// https://github.com/loksland/pixel-art-game-test
TextureSource.defaultOptions.scaleMode = 'nearest'
const texture = Texture.from(canvas)

export const useGraphicsStore = defineStore('graphics', {
  state: () => {
    return {
      compositeAt: Date.now(),
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
    }
  },
})
