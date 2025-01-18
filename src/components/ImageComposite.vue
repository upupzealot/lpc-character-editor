<script lang="ts">
import { mapState } from 'pinia'
import { useGraphicsStore } from '@/stores/graphics'
import { useEditerStore } from '@/stores/editor'
import { loadImage, replaceColor } from '@/util/GraphicUtil'

export default {
  computed: {
    ...mapState(useGraphicsStore, ['composite']),
    ...mapState(useEditerStore, ['selections', 'selectedItems', 'paletteMap']),
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

      const partKeys = ['body', 'hair', 'shirt']
      const imgMap = {} as { [k: string]: null | HTMLImageElement }
      let lastImg = null as null | HTMLImageElement
      await Promise.all(
        partKeys.map(async (partKey) => {
          let img = null as null | HTMLImageElement
          const imgSrc = this.selectedItems[partKey].image
          if (imgSrc) {
            img = await loadImage(
              `images/${partKey}/${this.selectedItems[partKey].image}`,
            )
          }
          imgMap[partKey] = img
          lastImg = lastImg || img
        }),
      )
      if (lastImg) {
        this.composite.canvas().width = lastImg.naturalWidth
        this.composite.canvas().height = lastImg.naturalHeight
      }
      for (let i = 0; i < partKeys.length; i++) {
        const partKey = partKeys[i]
        const img = imgMap[partKey]
        if (img) {
          const srcPalettes = this.selectedItems[partKey].palettes
          const dstPalattes = this.selections[partKey].palettes.map(
            (paletteKey) => this.paletteMap[paletteKey].colors,
          )
          const bodyCanvas = await replaceColor(img, srcPalettes, dstPalattes)
          this.composite.g2d().drawImage(bodyCanvas, 0, 0)
        }
      }

      this.composite.texture().source.update()
    },
  },
}
</script>
