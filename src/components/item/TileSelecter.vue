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
</template>

<script lang="ts">
export default {
  props: {
    modelValue: {
      type: [HTMLImageElement, null],
      required: true,
    },
    scaleTo: {
      type: Number,
      default: 64,
    },
    previewImage: {
      type: [HTMLImageElement, null],
    },
    previewAlpha: {
      type: Number,
      default: 0.3,
    },
  },
  emits: ['update:modelValue'],
  watch: {
    modelValue() {
      this.draw(this.modelValue)
    },
    previewImage() {
      this.draw(this.modelValue)
    },
  },
  methods: {
    openSelecter() {
      const $input = this.$refs.tileInput as HTMLInputElement
      $input.click()
    },
    async onTileSelected() {
      const image = await this.tileSelected()
      this.$emit('update:modelValue', image)
    },
    async tileSelected(): Promise<HTMLImageElement | null> {
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
              this.draw(image)
              resolve(image)
            }
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      } else {
        return Promise.resolve(null)
      }
    },
    draw(image: HTMLImageElement | null) {
      if (!image) return

      const canvas = this.$refs.tileCanvas as HTMLCanvasElement
      const scale = Math.ceil(this.scaleTo / image.naturalHeight)
      canvas.width = image.naturalWidth * scale
      canvas.height = image.naturalHeight * scale
      const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
      g2d.clearRect(0, 0, canvas.width, canvas.height)
      g2d.imageSmoothingEnabled = false

      g2d.scale(scale, scale)
      if (this.previewImage) {
        g2d.save()
        if (this.previewAlpha) {
          g2d.globalAlpha = this.previewAlpha
        }
        g2d.drawImage(this.previewImage, 0, 0)
        g2d.restore()
      }
      g2d.drawImage(image, 0, 0)
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
