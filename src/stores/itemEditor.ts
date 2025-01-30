import { defineStore } from 'pinia'

export const useItemEditerStore = defineStore('itemEditor', {
  state: () => {
    return {
      /** 编辑器浏览状态 */
      state: {
        opPart: '',
      },
    }
  },
  persist: {
    key: 'item-editor',
    storage: localStorage,
  },
})
