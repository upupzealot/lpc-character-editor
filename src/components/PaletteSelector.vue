<template>
  <div class="wrapper">
    <div class="title">Palette</div>
    <div class="palette-list">
      <div
        v-for="(palette, i) in palettes"
        :key="palette.name"
        :class="
          palette.key === selections[currentPartKey].palette
            ? ['palette-item', 'selected']
            : ['palette-item']
        "
        :style="{
          width: `${iconsize}px`,
          height: `${iconsize}px`,
          backgroundImage: canvasUrl,
          backgroundPositionX: `-${iconsize * i}px`,
        }"
        @click="selectPalette(palette)"
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
    itemImageUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    // const palettes = this.paletteList.filter((p, i) => {
    //   return i % 20 === 0
    // })
    return {
      // palettes,
      canvasUrl: 'none',
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
        this.canvasUrl = 'none'
        await this.getCanvasUrl()
      }
    },
  },
  methods: {
    selectPalette(palette: Palette) {
      this.selections[this.currentPartKey].palette = palette.key
      console.log(this.selections)
    },
    async getCanvasUrl() {
      const t0 = Date.now()

      const canvas = this.ctx.canvas() as HTMLCanvasElement
      const g2d = this.ctx.g2d() as CanvasRenderingContext2D
      g2d.clearRect(0, 0, canvas.width, canvas.height)

      const palettes = this.palettes
      const srcPalette = this.currentItem.palette

      for (let i = 0; i < palettes.length; i++) {
        const palette = palettes[i].palette
        const image = await loadImage(this.itemImageUrl)

        const imageCanvas = new OffscreenCanvas(this.size, this.size)
        const imgG2d = imageCanvas.getContext(
          '2d',
        ) as OffscreenCanvasRenderingContext2D
        imgG2d.drawImage(image, 0, 0)
        const imageData = imgG2d.getImageData(0, 0, this.size, this.size)
        const { data } = imageData
        for (let x = 0; x < data.length; x += 4) {
          for (let n = 0; n < palette.length; n++) {
            const srcColor = srcPalette[n]
            const dstColor = palette[n]
            if (
              data[x] === srcColor[0] &&
              data[x + 1] === srcColor[1] &&
              data[x + 2] === srcColor[2]
            ) {
              data[x] = dstColor[0]
              data[x + 1] = dstColor[1]
              data[x + 2] = dstColor[2]
              break
            }
          }
        }
        imgG2d.putImageData(imageData, 0, 0)
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
.title {
  height: 16px;
  padding: 5px 10px 0px 10px;
}
.palette-list {
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
