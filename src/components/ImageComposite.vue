<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import { loadImage, replaceColor } from '@/util/ImageUtil'

export default {
  computed: {
    ...mapState(useEditerStore, [
      'composite',
      'selections',
      'selectedItems',
      'paletteMap',
    ]),
    ...mapWritableState(useEditerStore, ['updatedAt']),
  },
  watch: {
    selections: {
      async handler() {
        await this.draw()
      },
      deep: true,
    },
  },
  methods: {
    async draw() {
      const canvas = this.composite.canvas()
      this.composite.g2d().clearRect(0, 0, canvas.width, canvas.height)

      let bodyImg = null
      let hairImg = null
      const bodySrc = this.selectedItems.body.image
      const hairSrc = this.selectedItems.hair.image

      if (bodySrc) {
        bodyImg = await loadImage(
          `images/body/${this.selectedItems.body.image}`,
        )
      }
      if (hairSrc) {
        hairImg = await loadImage(
          `images/hair/${this.selectedItems.hair.image}`,
        )
      }

      const lastImg = bodyImg || hairImg
      if (lastImg) {
        this.composite.canvas().width = lastImg.naturalWidth
        this.composite.canvas().height = lastImg.naturalHeight
      }

      if (bodyImg) {
        const srcPalette = this.selectedItems.body.palette
        const dstPalatte =
          this.paletteMap[this.selections['body'].palette].palette
        const bodyCanvas = await replaceColor(bodyImg, srcPalette, dstPalatte)
        this.composite.g2d().drawImage(bodyCanvas, 0, 0)
      }
      if (hairImg) {
        const srcPalette = this.selectedItems.hair.palette
        const dstPalatte =
          this.paletteMap[this.selections['hair'].palette].palette
        const hairCanvas = await replaceColor(hairImg, srcPalette, dstPalatte)
        this.composite.g2d().drawImage(hairCanvas, 0, 0)
      }

      this.composite.texture().source.update()
      this.updatedAt = Date.now()
    },
  },
}
</script>
