<template>
  <div class="button" @click="selectPart(partKey)">
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
        <div v-for="(palette, i) in partPaletteKeys" :key="i" class="palette">
          <div
            v-for="(color, j) in palette.colors"
            :key="j"
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
import { mapState } from 'pinia'
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
    ...mapState(useEditerStore, ['state', 'selections', 'selectedItems']),
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
    partPaletteKeys() {
      return this.selections[this.partKey].palettes
    },
  },
  methods: {
    selectPart(partKey: string) {
      this.state.opPart = partKey
      this.state.opItem = this.selectedItems[partKey].key
      this.state.opPaletteIndex = 0
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
  @media screen and (max-width: 600px) {
    padding: 5px 5px 0 5px;
  }
}
.content {
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  @media screen and (max-width: 600px) {
    padding: 5px;
  }
}
.setting {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}
.select {
  height: 20px;
  width: 0;
  white-space: nowrap;
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
  @media screen and (max-width: 600px) {
    height: 6px;
    width: 6px;
  }
}
</style>
