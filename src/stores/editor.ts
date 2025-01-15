import { defineStore } from 'pinia'
import { Texture, TextureSource } from 'pixi.js'

const canvas = document.createElement('canvas')
canvas.style.imageRendering = 'pixelated'
// document.body.prepend(canvas)
const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

// https://github.com/loksland/pixel-art-game-test
TextureSource.defaultOptions.scaleMode = 'nearest'
const texture = Texture.from(canvas)

import bodyItems from '@/assets/item-data/body.ts'
import hairItems from '@/assets/item-data/hair.ts'

type Item = {
  key: string
  name: string
  image: string
}
const itemListGroup = {
  body: bodyItems,
  hair: hairItems,
} as unknown as {
  [k: string]: [Item]
}
const itemMapGroup = {} as {
  [k: string]: {
    [k: string]: Item
  }
}
for (const part in itemListGroup) {
  itemListGroup[part].forEach((item) => {
    if (!itemMapGroup[part]) {
      itemMapGroup[part] = {}
    }
    itemMapGroup[part][item.key] = item
  })
}

export const useEditerStore = defineStore('editor', {
  state: () => {
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

      itemListGroup,
      itemMapGroup,

      editPart: '',
      selectedKeys: {
        body: 'body-1',
        hair: 'hair-1',
      } as {
        [k: string]: string
      },
    }
  },
  getters: {
    selectedItems() {
      const itemsMap = {} as {
        [k: string]: Item
      }
      for (const part in this.selectedKeys) {
        const key = this.selectedKeys[part]
        const item = this.itemMapGroup[part][key]
        itemsMap[part] = item
      }
      return itemsMap
    },
  },
})
