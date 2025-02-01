<template>
  <input
    ref="tileInput"
    type="file"
    accept=".mini.png"
    @change="onTileSelected"
    hidden="hidden"
  />
  <img ref="tileImage" hidden="hidden" />
  <canvas
    ref="tileCanvas"
    :class="modelValue ? 'preview-img' : ['preview-img', 'hidden']"
  ></canvas>
  <a-button @click="onTileSelecterOpen()">
    {{ btnText }}
  </a-button>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'

export default {
  props: {
    btnText: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    ...mapState(useItemEditerStore, ['state']),
  },
  methods: {
    onTileSelecterOpen() {
      const $input = this.$refs.tileInput as HTMLInputElement
      $input.click()
    },
    async onTileSelected() {
      const dataUrl = await this.tileSelected()
      this.$emit('update:modelValue', dataUrl)
    },
    async tileSelected(): Promise<string> {
      const $input = this.$refs.tileInput as HTMLInputElement
      const file = $input.files?.length && $input.files[0]

      let dataUrl = ''
      if (file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            dataUrl = reader.result as string
            const image = this.$refs.tileImage as HTMLImageElement
            image.src = dataUrl
            image.onload = () => {
              const canvas = this.$refs.tileCanvas as HTMLCanvasElement
              const scale = Math.ceil(64 / image.naturalHeight)
              canvas.width = image.naturalWidth * scale
              canvas.height = image.naturalHeight * scale
              const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
              g2d.scale(scale, scale)
              g2d.imageSmoothingEnabled = false
              g2d.drawImage(image, 0, 0)
            }
            resolve(dataUrl)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      } else {
        return Promise.resolve(dataUrl)
      }
    },
  },
}
</script>

<style scoped>
.preview-img {
  image-rendering: pixelated;
  display: block;
  border: rgb(217, 217, 217) 1px solid;
  border-radius: 4px;
  margin-bottom: 10px;
}
.preview-img.hidden {
  display: none;
}
</style>
