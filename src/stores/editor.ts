import { defineStore } from 'pinia'

import type { Color, Item } from '@/components/types'
import { itemListGroup, itemMapGroup } from '@/stores/itemData'
import { paletteList, paletteMap } from '@/stores/paletteData'

export const useEditerStore = defineStore('editor', {
  state: () => {
    return {
      size: 32,
      scale: 2,

      direction: 'left',
      action: 'walk',

      itemListGroup,
      itemMapGroup,

      paletteList,
      paletteMap,

      /** 编辑器浏览状态 */
      state: {
        opPart: '',
        opItem: '',
        opPaletteIndex: 0,
        // palettes: [] as string[],
      },
      /** 编辑器选择状态 */
      selections: {
        body: {
          key: 'body-1',
          palettes: ['faece7;f9d5ba;e4a47c;cc8665;99423c;2a1722'],
        },
        hair: {
          key: 'hair-1',
          palettes: ['946b44;75502d;61482c;40361d;2b2511;1a1213'],
        },
        shirt: {
          key: 'shirt-1',
          palettes: ['cf6f30;b54936;95381c;7b2008;6a1d16;3e111a'],
        },
      } as {
        [k: string]: {
          key: string
          palettes: string[]
        }
      },
    }
  },
  getters: {
    /** 打开的部位 Key */
    opPartKey(): string {
      return this.state.opPart
    },
    /** 打开部位的项目列表 */
    opPartItems(): Item[] {
      return this.itemListGroup[this.opPartKey]
    },
    /** 打开的项目Key */
    opItemKey(): string {
      return this.state.opItem
    },
    /** 打开的项目 */
    opItem(): Item {
      return this.itemMapGroup[this.opPartKey][this.opItemKey]
    },
    /** 打开的项目的色板 */
    opItemPalettes(): Color[][] {
      return this.opItem.palettes
    },
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
    /** 打开的项目当前选中的色板索引 */
    selectedPaletteIndex(): number {
      return this.state.opPaletteIndex
    },
    /** 打开的项目当前选中的色板 */
    selectedPalette(): Color[] {
      return this.opItemPalettes[this.selectedPaletteIndex]
    },
  },
})
