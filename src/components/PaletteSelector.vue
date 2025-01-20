<template>
  <div class="wrapper">
    <div class="palette-list" style="position: relative">
      <div
        v-for="(palette, i) in opItem.palettes"
        :key="i"
        :class="
          i === selectedPaletteIndex
            ? ['palette-tab', 'selected']
            : ['palette-tab']
        "
        @click="selectPaletteIndex(i)"
      >
        Palette {{ i + 1 }}:
      </div>
      <div class="palette-setting">
        <div
          :class="
            mode === 'preview'
              ? ['palette-setting-btn', 'selected']
              : ['palette-setting-btn']
          "
          @click="mode = 'preview'"
        ></div>
        <div
          :class="
            mode === 'icon'
              ? ['palette-setting-btn', 'selected']
              : ['palette-setting-btn']
          "
          :style="{ backgroundImage: `url(${iconUrl})` }"
          @click="mode = 'icon'"
        ></div>
      </div>
    </div>
    <div class="palette-preview">
      <div
        v-for="(palette, i) in palettes"
        :key="palette.name"
        :class="
          palette.key ===
          selections[opPartKey].palettes[selectedPaletteIndex].key
            ? ['palette-item', 'selected']
            : ['palette-item']
        "
        :style="{
          width: `${iconsize}px`,
          height: `${iconsize}px`,
          backgroundImage: canvasUrl,
          backgroundPositionX: `-${iconsize * i}px`,
        }"
        @click="selectPalette(selectedPaletteIndex, palette)"
      >
        <!-- {{ palette.name }} -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import type { Palette } from '@/components/types'
import { loadImage, replaceColor } from '@/util/GraphicUtil'
import { getIconCanvas, ICON_SIZE, iconUrl } from '@/stores/paletteData'

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
      mode: 'icon',
      iconUrl,
      canvasUrl: 'none',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx: {} as any,
    }
  },
  async created() {
    const canvas = document.createElement('canvas')
    const size = Math.max(this.size * this.scale, ICON_SIZE)
    canvas.width = size * this.palettes.length
    canvas.height = size
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
      'paletteList',
      'state',
      'opPartKey',
      'opItem',
      'opItemPalettes',
      'selections',
      'selectedPaletteIndex',
      'selectedPalettes',
    ]),
    iconsize() {
      if (this.mode === 'preview') {
        return this.size * this.scale
      } else {
        // this.mode === 'icon'
        // marble.png size=16
        return ICON_SIZE * this.scale
      }
    },
    palettes() {
      return this.paletteList.filter((p, i) => {
        return i % 20 === 0
      })
    },
  },
  watch: {
    async mode() {
      if (this.itemImageUrl) {
        await this.getCanvasUrl()
      }
    },
    async itemImageUrl() {
      if (this.itemImageUrl) {
        await this.getCanvasUrl()
      }
    },
    async selectedPaletteIndex() {
      if (this.itemImageUrl) {
        await this.getCanvasUrl()
      }
    },
  },
  methods: {
    selectPaletteIndex(index: number) {
      this.state.opPaletteIndex = index
    },
    selectPalette(paletteIndex: number, palette: Palette) {
      this.selections[this.opPartKey].palettes[paletteIndex] = palette
    },
    async getCanvasUrl() {
      if (this.mode === 'preview') {
        return this.getPreviewCanvasUrl()
      } else {
        // this.mode === 'icon'
        return this.getIconCanvasUrl()
      }
    },
    async getIconCanvasUrl() {
      const t0 = Date.now()

      const canvas = this.ctx.canvas() as HTMLCanvasElement
      const g2d = this.ctx.g2d() as CanvasRenderingContext2D
      g2d.clearRect(0, 0, canvas.width, canvas.height)

      const imageCanvas = await getIconCanvas(this.palettes)
      for (let i = 0; i < this.palettes.length; i++) {
        g2d.drawImage(
          imageCanvas,
          i * ICON_SIZE,
          0,
          ICON_SIZE,
          ICON_SIZE,
          i * this.iconsize,
          0,
          this.iconsize,
          this.iconsize,
        )
      }

      this.canvasUrl = `url(${canvas.toDataURL('image/png')})`
      console.log('color replacement cost: ', Date.now() - t0, 'ms')
    },
    async getPreviewCanvasUrl() {
      const t0 = Date.now()

      const canvas = this.ctx.canvas() as HTMLCanvasElement
      const g2d = this.ctx.g2d() as CanvasRenderingContext2D
      g2d.clearRect(0, 0, canvas.width, canvas.height)

      // 当前项目的原始色板
      const srcPalettes = this.opItemPalettes
      const srcColors = srcPalettes.map((p) => p.colors)
      // 当前项目选中的色板
      const selectedPalettes = this.selectedPalettes
      // 待预览的色板列表
      const dstPalettes = this.palettes as Palette[]
      const image = await loadImage(this.itemImageUrl)
      for (let i = 0; i < dstPalettes.length; i++) {
        const previewPalettes = selectedPalettes.map((palette, index) => {
          return index === this.selectedPaletteIndex ? dstPalettes[i] : palette
        })

        const previewColors = previewPalettes.map((p) => p.colors)
        const imageCanvas = await replaceColor(image, srcColors, previewColors)
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
.palette-setting {
  position: absolute;
  right: 0;

  height: 36px;
  line-height: 36px;
  padding: 0px 10px;
  margin: 0 -2.5px;

  display: flex;
  flex-direction: row;
}
.palette-setting-btn {
  width: 32px;
  height: 32px;
  background-color: aqua;
  image-rendering: pixelated;
  background-size: 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  margin: 0 2.5px;
  border: transparent 2px solid;
}
.palette-setting-btn.selected {
  border: black 2px solid;
}
.palette-preview {
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  margin: 0 -2.5px;
}
.palette-item {
  background-color: aliceblue;
  background-repeat: no-repeat;
  margin: 2.5px;
  border: aliceblue 2px solid;
  image-rendering: pixelated;
  cursor: pointer;
}
.palette-item.selected {
  border-color: black;
}
</style>
