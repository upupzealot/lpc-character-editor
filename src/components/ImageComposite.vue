<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useGraphicsStore } from '@/stores/graphics'
import { useCharacterEditerStore } from '@/stores/characterEditor'
import { loadImage, replaceColor } from '@/util/GraphicUtil'
import { renderOrder } from '@/components/ImageComposite'
import CharactorActions from '@/components/CharacterActionsData.json'

export default {
  computed: {
    ...mapState(useGraphicsStore, ['composite']),
    ...mapWritableState(useGraphicsStore, ['compositeAt']),
    ...mapState(useCharacterEditerStore, [
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

      const bodyItem = this.selectedItems['body']
      const bodySize = (bodyItem && bodyItem.size) || 32
      let maxSize = bodySize
      const imgMap = {} as { [k: string]: null | HTMLImageElement }
      let lastImg = null as null | HTMLImageElement

      await Promise.all(
        partKeys.map(async (partKey) => {
          let img = null as null | HTMLImageElement
          const partItem = this.selectedItems[partKey]
          if (partItem.size) {
            maxSize = Math.max(maxSize, partItem.size)
          }
          if (partItem.image) {
            img = await loadImage(`images/${partKey}/${partItem.image}`)
          }
          imgMap[partKey] = img
          lastImg = lastImg || img
        }),
      )
      const bodyImg = imgMap['body'] as HTMLImageElement
      lastImg = bodyImg || lastImg
      if (lastImg) {
        this.composite.canvas().width =
          (bodyImg.naturalWidth / bodySize) * maxSize
        this.composite.canvas().height =
          (bodyImg.naturalHeight / bodySize) * maxSize
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

      for (const action of CharactorActions) {
        const partKeysInOrder = renderOrder(action.direction)
        for (let i = 0; i < partKeysInOrder.length; i++) {
          let partKey = partKeysInOrder[i]

          let canvas
          if (partKey.includes('.')) {
            const [part, mask] = partKey.split('.')
            partKey = part
            const partCanvas = canvasMap[part]
            canvas = new OffscreenCanvas(partCanvas.width, partCanvas.height)
            const g2d = canvas.getContext(
              '2d',
            ) as OffscreenCanvasRenderingContext2D
            g2d.imageSmoothingEnabled = false
            g2d.drawImage(partCanvas, 0, 0)
            g2d.globalCompositeOperation = 'destination-in'
            const partImgUrl = this.selectedItems[part].image
            const maskImg = await loadImage(
              `images/${part}/${partImgUrl.replace('.png', `.${mask}mask.png`)}`,
            )
            g2d.drawImage(maskImg, 0, 0)
          } else {
            canvas = canvasMap[partKey]
          }

          const item = this.selectedItems[partKey]
          const itemSize = item.size || 32
          if (canvas) {
            for (let i = 0; i < action.frameCount; i++) {
              this.composite
                .g2d()
                .drawImage(
                  canvas,
                  (action.x + i) * itemSize,
                  action.y * itemSize,
                  itemSize,
                  itemSize,
                  (action.x + i) * maxSize + (maxSize - itemSize) / 2,
                  action.y * maxSize + (maxSize - itemSize) / 2,
                  itemSize,
                  itemSize,
                )
            }
          }
        }
      }

      this.composite.texture().source.update()
      this.compositeAt = Date.now()
    },
  },
}
</script>
