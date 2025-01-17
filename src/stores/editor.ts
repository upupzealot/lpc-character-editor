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
import shirtItems from '@/assets/item-data/shirt'
const itemListGroup = {
  body: bodyItems,
  hair: hairItems,
  shirt: shirtItems,
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
import { encodeColor } from '@/util/GraphicUtil'
const paletteList = (PaletteData as Palette[]).map((palette) => {
  const key = palette.palette.map((color) => encodeColor(color)).join(';')
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
          palette: 'faece7;f9d5ba;e4a47c;cc8665;99423c;2a1722',
        },
        hair: {
          key: 'hair-1',
          palette: 'ad844f;946b44;75502d;61482c;40361d;2b2511',
        },
        shirt: {
          key: 'shirt-1',
          palette: 'cf6f30;b54936;95381c;7b2008;6a1d16;3e111a',
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
