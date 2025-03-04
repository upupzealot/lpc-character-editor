<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useGraphicsStore } from '@/stores/graphics'
import { useCharacterEditerStore } from '@/stores/characterEditor'
import { loadImage, loadCanvas, replaceCanvasColor } from '@/util/GraphicUtil'
import { renderOrder } from '@/components/character/ImageComposite'
import CharactorActions from '@/components/character/CharacterActionsData.json'

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

      const partLayerKeys = [
        'body',
        'lower',
        'upper',
        'hair',
        'hair.back',
        'ear',
        'eye',
        'weapon',
      ]

      const bodyItem = this.selectedItems['body']
      const bodySize = (bodyItem && bodyItem.size) || 32
      let maxSize = bodySize
      const canvasMap = {} as { [k: string]: null | HTMLCanvasElement }
      let lastCanvas = null as null | HTMLCanvasElement

      await Promise.all(
        partLayerKeys.map(async (partLayerKey) => {
          let canvas = null as null | HTMLCanvasElement
          const [partKey, layerKey] = partLayerKey.split('.')
          const partItem = this.selectedItems[partKey]
          if (partItem.size) {
            maxSize = Math.max(maxSize, partItem.size)
          }
          let imageJsonKey = 'image'
          if (layerKey) {
            imageJsonKey = `image.${layerKey}`
          }
          const imageUrl = (partItem as unknown as { [k: string]: string })[
            imageJsonKey
          ] as string | undefined
          if (imageUrl) {
            canvas = await loadCanvas(`images/${partKey}/${imageUrl}`)
          }
          canvasMap[partLayerKey] = canvas
          lastCanvas = lastCanvas || canvas
        }),
      )
      const bodyCanvas = canvasMap['body'] as HTMLCanvasElement
      lastCanvas = bodyCanvas || lastCanvas
      if (lastCanvas) {
        this.composite.canvas().width = (bodyCanvas.width / bodySize) * maxSize
        this.composite.canvas().height =
          (bodyCanvas.height / bodySize) * maxSize
      }

      for (let i = 0; i < partLayerKeys.length; i++) {
        const partLayerKey = partLayerKeys[i]
        const [partKey] = partLayerKey.split('.')
        const canvas = canvasMap[partLayerKey]
        if (canvas) {
          const srcPaletteColors = this.selectedItems[partKey].palettes.map(
            (palette) => palette.colors,
          )
          const dstPalatteColors = this.selections[partKey].palettes.map(
            (palette) => palette.colors,
          )
          canvasMap[partLayerKey] = (await replaceCanvasColor(
            srcPaletteColors,
            dstPalatteColors,
            canvas,
          )) as HTMLCanvasElement
        }
      }

      for (const action of CharactorActions) {
        const partLayerKeysInOrder = renderOrder(action.direction)
        for (let i = 0; i < partLayerKeysInOrder.length; i++) {
          const partLayerKey = partLayerKeysInOrder[i]
          let [partKey] = partLayerKey.split('.')

          let canvas
          if (partKey.includes('@')) {
            const [part, mask] = partKey.split('@')
            partKey = part
            const partCanvas = canvasMap[part] as HTMLCanvasElement
            canvas = document.createElement('canvas')
            canvas.width = partCanvas.width
            canvas.height = partCanvas.height
            const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
            g2d.imageSmoothingEnabled = false
            g2d.drawImage(partCanvas, 0, 0)
            g2d.globalCompositeOperation = 'destination-in'
            const partImgUrl = this.selectedItems[part].image
            const maskImg = await loadImage(
              `images/${part}/${partImgUrl.replace('.png', `.${mask}mask.png`)}`,
            )
            g2d.drawImage(maskImg, 0, 0)
          } else {
            canvas = canvasMap[partLayerKey]
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
