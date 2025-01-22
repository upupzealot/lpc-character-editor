import { defineStore } from 'pinia'

import type { Item, Palette } from '@/components/types'
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
      },
      /** 编辑器选择状态 */
      selections: {
        body: {
          itemKey: 'body-1',
          palettes: [paletteMap['faece7;f9d5ba;e4a47c;cc8665;99423c;2a1722']],
        },
        hair: {
          itemKey: 'hair-1',
          palettes: [paletteMap['946b44;75502d;61482c;40361d;2b2511;1a1213']],
        },
        eye: {
          itemKey: 'eye-1',
          palettes: [paletteMap['946b44;75502d;61482c;40361d;2b2511;1a1213']],
        },
        ear: {
          itemKey: 'ear-1',
          palettes: [paletteMap['faece7;f9d5ba;e4a47c;cc8665;99423c;2a1722']],
        },
        // ----- ----- //
        upper: {
          itemKey: 'upper-1',
          palettes: [paletteMap['cf6f30;b54936;95381c;7b2008;6a1d16;3e111a']],
        },
        lower: {
          itemKey: 'lower-1',
          palettes: [paletteMap['4273c9;324f9a;293982;1d2560;181842;101025']],
        },
        weapon: {
          itemKey: 'weapon-1',
          palettes: [paletteMap['ffffff;e0f2f3;c7cfcc;818e97;595e70;29253a']],
        },
      } as {
        [k: string]: {
          itemKey: string
          palettes: Palette[]
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
    opItemPalettes(): Palette[] {
      return this.opItem.palettes
    },
    /** 每个部位当前选中的项目 */
    selectedItems() {
      const itemsMap = {} as {
        [k: string]: Item
      }
      for (const part in this.selections) {
        const itemKey = this.selections[part].itemKey
        const item = this.itemMapGroup[part][itemKey]
        itemsMap[part] = item
      }
      return itemsMap
    },
    /** 打开的项目当前选中的色板索引 */
    selectedPaletteIndex(): number {
      return this.state.opPaletteIndex
    },
    /** 打开的项目当前选中的色板 */
    selectedPalettes(): Palette[] {
      return this.selections[this.opPartKey].palettes
    },
  },
})
