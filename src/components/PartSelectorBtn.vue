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
          backgroundSize: backgroundSize,
        }"
      ></div>
      <div class="setting">
        <div class="select">{{ partItem.name }}</div>
        <div class="palette">
          <div
            v-for="(color, i) in partPalette.colors"
            :key="i"
            class="color-box"
            :style="{
              backgroundColor: `rgba(${color[0]},${color[1]},${color[2]},${color[3] / 255})`,
            }"
          ></div>
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
    ...mapState(useEditerStore, ['selectedItems', 'selections', 'paletteMap']),
    ...mapWritableState(useEditerStore, ['editPart']),
    iconsize() {
      if (this.size <= 32) {
        return 32
      } else {
        return this.size
      }
    },
    iconUrl() {
      if (this.partItem.image) {
        return `url(\'/images/${this.partKey}/${this.partItem.image}\')`
      } else {
        return "url('/images/none.png')"
      }
    },
    backgroundSize() {
      if (this.partItem.image) {
        return 'initial'
      } else {
        return `${this.iconsize}px`
      }
    },
    partItem() {
      return this.selectedItems[this.partKey]
    },
    partPalette() {
      return this.paletteMap[this.selections[this.partKey].palette]
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
