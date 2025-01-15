<template>
  <div class="button" @click="focusPart">
    <div class="title">{{ partKey }}</div>
    <div class="content">
      <div
        class="icon"
        :style="{
          width: `${iconsize}px`,
          height: `${iconsize}px`,
          backgroundImage: iconUrl,
        }"
      ></div>
      <div class="setting">
        <div class="select">{{ selectedItems[partKey].name }}</div>
        <div class="palette">
          <div class="color-box" style="background-color: coral"></div>
          <div class="color-box" style="background-color: lightcoral"></div>
          <div class="color-box" style="background-color: pink"></div>
          <div class="color-box" style="background-color: lightpink"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'

export default {
  props: {
    partKey: {
      type: String,
      required: true,
    },
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
    ...mapState(useEditerStore, ['selectedItems']),
    ...mapWritableState(useEditerStore, ['editPart']),
    iconsize() {
      if (this.size <= 32) {
        return 32
      } else {
        return this.size
      }
    },
    iconUrl() {
      const item = this.selectedItems[this.partKey]
      if (item) {
        return `url(\'/images/${this.partKey}/${item.image}\'`
      } else {
        return 'none'
      }
    },
  },
  methods: {
    focusPart() {
      this.editPart = this.partKey
    },
  },
}
</script>

<style scoped>
.button {
  background-color: white;

  font-size: 14px;
  cursor: pointer;
}
.title {
  height: 16px;
  padding: 5px 10px 0px 10px;
}
.content {
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
}
.setting {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}
.select {
  height: 20px;
}
.icon {
  background-color: lightblue;
  image-rendering: pixelated;
}
.palette {
  display: flex;
  flex-direction: row;
}
.color-box {
  height: 12px;
  width: 12px;
}
</style>
