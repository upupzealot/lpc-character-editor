import { defineStore } from 'pinia'
import { itemListGroup, itemMapGroup } from '@/stores/itemData'
import type { TilesetData } from '@/components/item/maker/Util'

export const useItemEditerStore = defineStore('itemEditor', {
  state: () => {
    return {
      tileset: {
        imageCanvas: null as HTMLCanvasElement | null,
        dataCanvas: null as HTMLCanvasElement | null,
        data: null as TilesetData | null,
      },
      layer: {
        body: 'body-1',
        canvas: null as HTMLCanvasElement | null,
        data: {} as {
          name: string
          key: string
          image: string
          size: number
          palette1: string
          palette2: string
          palette3: string
          palette4: string
        },
      },

      itemListGroup,
      itemMapGroup,

      /** 编辑器操作状态 */
      state: {
        opPart: '',
      },
    }
  },
  persist: {
    key: 'item-editor',
    storage: localStorage,
    omit: ['tileset', 'layer'],
  },
})
