<template>
  <input
    ref="input"
    type="file"
    accept=".ase,.aseprite"
    @change="onSelected"
    hidden="hidden"
  />
  <canvas
    ref="canvas"
    :class="modelValue ? 'preview-img' : ['preview-img', 'hidden']"
  ></canvas>
</template>

<script lang="ts">
import type { IAse } from '@/util/AsepriteUtil'
import { Ase } from '@/util/AsepriteUtil'

export default {
  props: {
    modelValue: {
      type: [Object as () => IAse, null],
      required: true,
    },
    scaleTo: {
      type: Number,
      default: 64,
    },
  },
  emits: ['update:modelValue'],
  watch: {
    modelValue() {
      this.draw()
    },
  },
  methods: {
    openSelecter() {
      const $input = this.$refs.input as HTMLInputElement
      $input.click()
    },
    async onSelected() {
      const ase = await this.select()
      this.$emit('update:modelValue', ase)
    },
    async select(): Promise<IAse | null> {
      const $input = this.$refs.input as HTMLInputElement
      const file = $input.files?.length && $input.files[0]

      if (file && file.name.endsWith('.aseprite')) {
        return new Promise(async (resolve, reject) => {
          const ase = new Ase(file)
          try {
            await ase.parse()
            resolve(ase)
          } catch (e) {
            reject(e)
          }
        })
      } else {
        return null
      }
    },
    draw() {
      const ase = this.modelValue
      if (!ase) return

      const canvas = this.$refs.canvas as HTMLCanvasElement
      const scale = Math.ceil(this.scaleTo / ase.height)
      canvas.width = ase.width * scale
      canvas.height = ase.height * scale
      const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
      g2d.clearRect(0, 0, canvas.width, canvas.height)
      g2d.imageSmoothingEnabled = false

      g2d.scale(scale, scale)
      g2d.drawImage(ase.canvas!, 0, 0)
    },
  },
}
</script>

<style scoped>
.preview-img {
  image-rendering: pixelated;
  display: block;
  border: rgb(217, 217, 217) 1px solid;
  border-radius: 6px;
}
.preview-img.hidden {
  display: none;
}
</style>
