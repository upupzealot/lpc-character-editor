<script lang="ts">
import { mapState } from 'pinia'
import { useGraphicsStore } from '@/stores/graphics'
import { useEditerStore } from '@/stores/editor'
import { loadImage, replaceColor } from '@/util/GraphicUtil'
import CharactorActions from '@/components/CharacterActionsData.json'

export default {
  computed: {
    ...mapState(useGraphicsStore, ['composite']),
    ...mapState(useEditerStore, [
      'size',
      'selections',
      'selectedItems',
      'paletteMap',
    ]),
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

      const partKeys = [
        'body',
        'lower',
        'upper',
        'hair',
        'ear',
        'eye',
        'weapon',
      ]
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
      const bodyImg = imgMap['body'] as HTMLImageElement
      lastImg = bodyImg || lastImg
      if (lastImg) {
        this.composite.canvas().width = lastImg.naturalWidth
        this.composite.canvas().height = lastImg.naturalHeight
      }

      const canvasMap = {} as { [k: string]: OffscreenCanvas }
      for (let i = 0; i < partKeys.length; i++) {
        const partKey = partKeys[i]
        const img = imgMap[partKey]
        if (img) {
          const srcPaletteColors = this.selectedItems[partKey].palettes.map(
            (palette) => palette.colors,
          )
          const dstPalatteColors = this.selections[partKey].palettes.map(
            (palette) => palette.colors,
          )
          canvasMap[partKey] = await replaceColor(
            img,
            srcPaletteColors,
            dstPalatteColors,
          )
          // this.composite.g2d().drawImage(bodyCanvas, 0, 0)
        }
      }

      const renderOrder = {
        down: ['body', 'lower', 'upper', 'hair', 'ear', 'eye', 'weapon'],
        left: ['weapon', 'body', 'lower', 'upper', 'hair', 'ear', 'eye'],
        right: ['weapon', 'body', 'lower', 'upper', 'hair', 'ear', 'eye'],
        up: ['weapon', 'body', 'lower', 'upper', 'hair', 'ear', 'eye'],
      } as { [k: string]: string[] }
      for (const action of CharactorActions) {
        const partKeysInOrder = renderOrder[action.direction]
        for (let i = 0; i < partKeys.length; i++) {
          const partKey = partKeysInOrder[i]
          const canvas = canvasMap[partKey]
          if (canvas) {
            const x = action.x * this.size
            const y = action.y * this.size
            this.composite
              .g2d()
              .drawImage(
                canvas,
                x,
                y,
                this.size * action.frameCount,
                this.size,
                x,
                y,
                this.size * action.frameCount,
                this.size,
              )
          }
        }
      }

      this.composite.texture().source.update()
    },
  },
}
</script>
