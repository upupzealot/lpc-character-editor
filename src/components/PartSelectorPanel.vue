<template>
  <div class="wrapper" v-if="currentPartKey">
    <div class="title">{{ currentPartKey }}: {{ currentItem.name }}</div>
    <div class="item-list">
      <div
        v-for="(item, i) in partItems"
        :key="item.key"
        :class="item.key === currentItemKey ? ['item', 'selected'] : ['item']"
        :style="{
          ...styleObj,
          backgroundPositionX: `-${iconsize * i}px`,
        }"
        @click="selectItem(item.key)"
      >
        <!-- {{ item.name }} -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import loadImage from '@/util/LoadImage'

export default {
  props: {
    size: {
      type: Number,
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
  },
  data() {
    const canvasUrlMap = {} as { [k: string]: string }
    return {
      canvasUrlMap,
      canvasUrl: 'none',
    }
  },
  computed: {
    ...mapState(useEditerStore, [
      'itemListGroup',
      'itemMapGroup',
      'selectedKeys',
      'selectedItems',
    ]),
    ...mapWritableState(useEditerStore, ['editPart']),
    iconsize() {
      if (this.size <= 64) {
        return 64
      } else {
        return this.size
      }
    },
    partItems() {
      return this.itemListGroup[this.editPart]
    },
    currentPartKey() {
      return this.editPart
    },
    currentItemKey() {
      return this.selectedKeys[this.currentPartKey]
    },
    currentItem() {
      return this.selectedItems[this.currentPartKey]
    },
    styleObj() {
      return {
        width: `${this.iconsize}px`,
        height: `${this.iconsize}px`,
        backgroundImage: this.canvasUrl,
      }
    },
  },
  watch: {
    async currentPartKey(partKey) {
      let url = this.canvasUrlMap[partKey]
      if (!url) {
        url = await this.getItemCanvasUrl(this.currentPartKey)
        this.canvasUrlMap[partKey] = url
      }
      this.canvasUrl = url
    },
  },
  methods: {
    selectItem(key: string) {
      this.selectedKeys[this.editPart] = key
      console.log(this.selectedKeys)
    },
    async getItemCanvasUrl(partKey: string) {
      const items = this.itemListGroup[partKey]
      const canvas = document.createElement('canvas')
      canvas.width = this.iconsize * items.length
      canvas.height = this.iconsize
      const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        let imageUrl = '/images/none.png'
        if (item.image) {
          imageUrl = `/images/${partKey}/${item.image}`
        }
        const image = await loadImage(imageUrl)
        g2d.imageSmoothingEnabled = false
        g2d.drawImage(
          image,
          0, // TODO 使用 _part_config_ 里面的信息
          0, // TODO 使用 _part_config_ 里面的信息
          this.size, // TODO 使用 _part_config_ 里面的信息
          this.size, // TODO 使用 _part_config_ 里面的信息
          i * this.iconsize,
          0,
          this.iconsize,
          this.iconsize,
        )
      }

      return `url(${canvas.toDataURL('image/png')})`
    },
  },
}
</script>

<style scoped>
.wrapper {
  background-color: lightblue;
}
.title {
  height: 16px;
  padding: 5px 10px 0px 10px;
}
.item-list {
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  margin: 0 -5px;
}
.item {
  margin: 5px;
  padding: -5px;
  border: transparent 2px solid;

  background-color: aliceblue;
  image-rendering: pixelated;

  cursor: pointer;
}
.item.selected {
  border: black 2px solid;
}
</style>
