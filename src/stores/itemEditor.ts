import { defineStore } from 'pinia'
import { itemListGroup, itemMapGroup } from '@/stores/itemData'
import type { TileData } from '@/util/ItemUtil'

export const useItemEditerStore = defineStore('itemEditor', {
  state: () => {
    return {
      body: 'body-1',
      tileImage: null as HTMLImageElement | null,
      tileDataImage: null as HTMLImageElement | null,
      tileData: null as TileData | null,
      layerImage: null as HTMLImageElement | null,

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
    omit: ['tileImage', 'tileDataImage', 'tileData', 'layerImage'],
  },
})
