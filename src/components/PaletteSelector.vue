<template>
  <div class="wrapper">
    <div class="palette-list">
      <div
        v-for="(palette, i) in currentItem.palettes"
        :key="i"
        :class="i === editIndex ? ['palette-tab', 'selected'] : ['palette-tab']"
        @click="selectPaletteIndex(i)"
      >
        Palette {{ i + 1 }}:
      </div>
    </div>
    <div class="palette-preview">
      <div
        v-for="(palette, i) in palettes"
        :key="palette.name"
        :class="
          palette.key === selections[currentPartKey].palettes[editIndex]
            ? ['palette-item', 'selected']
            : ['palette-item']
        "
        :style="{
          width: `${iconsize}px`,
          height: `${iconsize}px`,
          backgroundImage: canvasUrl,
          backgroundPositionX: `-${iconsize * i}px`,
        }"
        @click="selectPalette(editIndex, palette)"
      >
        {{ palette.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import type { Palette } from '@/components/types'
import { loadImage, replaceColor } from '@/util/GraphicUtil'

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
    itemImageUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      canvasUrl: 'none',
      editIndex: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx: {} as any,
    }
  },
  async created() {
    const canvas = document.createElement('canvas')
    canvas.width = this.iconsize * this.palettes.length
    canvas.height = this.iconsize
    canvas.style.imageRendering = 'pixelated'
    const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
    g2d.imageSmoothingEnabled = false
    this.ctx.canvas = () => {
      return canvas
    }
    this.ctx.g2d = () => {
      return g2d
    }
    // document.body.prepend(canvas)

    await this.getCanvasUrl()
  },
  computed: {
    ...mapState(useEditerStore, [
      'itemMapGroup',
      'paletteList',
      'paletteMap',
      'editPart',
      'selections',
      'selectedItems',
    ]),
    iconsize() {
      if (this.size <= 64) {
        return 64
      } else {
        return this.size
      }
    },
    currentPartKey() {
      return this.editPart
    },
    currentItemKey() {
      return this.selections[this.currentPartKey].key
    },
    currentItem() {
      return this.selectedItems[this.currentPartKey]
    },
    palettes() {
      return this.paletteList.filter((p, i) => {
        return i % 20 === 0
      })
    },
  },
  watch: {
    async itemImageUrl() {
      if (this.itemImageUrl) {
        await this.getCanvasUrl()
      }
    },
    async editIndex() {
      if (this.itemImageUrl) {
        await this.getCanvasUrl()
      }
    },
  },
  methods: {
    selectPaletteIndex(index: number) {
      this.editIndex = index
    },
    selectPalette(paletteIndex: number, palette: Palette) {
      this.selections[this.currentPartKey].palettes[paletteIndex] = palette.key
    },
    async getCanvasUrl() {
      const t0 = Date.now()

      const canvas = this.ctx.canvas() as HTMLCanvasElement
      const g2d = this.ctx.g2d() as CanvasRenderingContext2D
      g2d.clearRect(0, 0, canvas.width, canvas.height)

      const palettes = this.palettes.map((palette) => palette.colors)
      const srcPalettes = this.currentItem.palettes[this.editIndex]

      for (let i = 0; i < palettes.length; i++) {
        const palette = palettes[i]
        const image = await loadImage(this.itemImageUrl)

        const imageCanvas = await replaceColor(image, [srcPalettes], [palette])
        g2d.drawImage(
          imageCanvas,
          0,
          0,
          this.size,
          this.size,
          i * this.iconsize,
          0,
          this.iconsize,
          this.iconsize,
        )
      }

      this.canvasUrl = `url(${canvas.toDataURL('image/png')})`
      console.log('color replacement cost: ', Date.now() - t0, 'ms')
    },
  },
}
</script>

<style scoped>
.wrapper {
  background-color: lightgoldenrodyellow;
}
.palette-list {
  display: flex;
  flex-direction: row;
}
.palette-tab {
  height: 16px;
  line-height: 16px;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
  border: transparent 2px solid;

  background-color: lightgoldenrodyellow;
}
.palette-tab.selected {
  border: black 2px solid;
}
.palette-preview {
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  margin: 0 -5px;
}
.palette-item {
  background-color: aliceblue;
  margin: 5px;
  padding: -5px;
  border: aliceblue 2px solid;
  image-rendering: pixelated;
  cursor: pointer;
}
.palette-item.selected {
  border-color: black;
}
</style>
