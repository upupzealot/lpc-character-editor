import { defineStore } from 'pinia'
import { Texture, TextureSource } from 'pixi.js'

const canvas = document.createElement('canvas')
canvas.style.imageRendering = 'pixelated'
// document.body.prepend(canvas)
const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

// https://github.com/loksland/pixel-art-game-test
TextureSource.defaultOptions.scaleMode = 'nearest'
const texture = Texture.from(canvas)

import type { Item, Palette } from '@/components/types'
import bodyItems from '@/assets/item-data/body.ts'
import hairItems from '@/assets/item-data/hair.ts'
const itemListGroup = {
  body: bodyItems,
  hair: hairItems,
} as unknown as {
  [k: string]: Item[]
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

// PaletteData comes from:
// https://github.com/vitruvianstudio/vitruvian-web/blob/main/src/data/colors.json
import PaletteData from '@/components/PaletteData.json'
const paletteList = PaletteData.map((palette) => {
  const key = palette.palette.map((color) => color.join(',')).join(';')
  return {
    ...palette,
    key,
  }
}) as Palette[]
const paletteMap = {} as { [k: string]: Palette }
paletteList.forEach((palette) => {
  paletteMap[palette.key] = palette
})

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

      paletteList,
      paletteMap,

      editPart: '',
      selections: {
        body: {
          key: 'body-1',
          palette:
            '250,236,231,255;249,213,186,255;228,164,124,255;204,134,101,255;153,66,60,255;42,23,34,255',
        },
        hair: {
          key: 'hair-1',
          palette:
            '173,132,79,255;148,107,68,255;117,80,45,255;97,72,44,255;64,54,29,255;43,37,17,255',
        },
      } as {
        [k: string]: {
          key: string
          palette: string
        }
      },
    }
  },
  getters: {
    /** 每个部位当前选中的项目 */
    selectedItems() {
      const itemsMap = {} as {
        [k: string]: Item
      }
      for (const part in this.selections) {
        const key = this.selections[part].key
        const item = this.itemMapGroup[part][key]
        itemsMap[part] = item
      }
      return itemsMap
    },
  },
})
