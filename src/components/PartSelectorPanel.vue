<template>
  <div class="wrapper" v-if="currentPartKey">
    <div class="title">{{ currentPartKey }}: {{ currentItem.name }}</div>
    <div class="item-list">
      <div
        v-for="item in partItems"
        :key="item.key"
        :class="item.key === currentItemKey ? ['item', 'selected'] : ['item']"
        :style="{ width: `${iconsize}px`, height: `${iconsize}px` }"
        @click="selectItem(item.key)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'

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
  computed: {
    ...mapState(useEditerStore, [
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
      return this.itemMapGroup[this.editPart]
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
  },
  methods: {
    selectItem(key: string) {
      this.selectedKeys[this.editPart] = key
      console.log(this.selectedKeys)
    },
  },
}
</script>

<style scoped>
.wrapper {
  background-color: lightblue;

  /* height: 200px; */
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
  background-color: aliceblue;
  margin: 5px;
  padding: -5px;
  border: transparent 2px solid;
  cursor: pointer;
}
.item.selected {
  border: black 2px solid;
}
</style>
