import { defineStore } from 'pinia'

export const useEditerStore = defineStore('editor', {
  state: () => {
    return {
      direction: 'left',
      size: 32,
      scale: 2,
    }
  },
  actions: {
    selectDirection(direction: string) {
      this.direction = direction
    },
  },
})
