import { defineStore } from 'pinia'
import { itemListGroup, itemMapGroup } from '@/stores/itemData'
import type { TileData } from '@/util/ItemUtil'

export const useItemEditerStore = defineStore('itemEditor', {
  state: () => {
    return {
      tile: {
        image: null as HTMLImageElement | null,
        imageUrl: '' as string,
        dataImage: null as HTMLImageElement | null,
        dataImageUrl: '' as string,
        data: null as TileData | null,
      },
      layer: {
        body: 'body-1',
        image: null as HTMLImageElement | null,
        imageUrl: '' as string,
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
    omit: ['tile', 'layer'],
  },
})
