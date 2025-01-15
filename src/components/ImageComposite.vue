<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'

export default {
  computed: {
    ...mapState(useEditerStore, ['composite', 'selectedKeys']),
    ...mapWritableState(useEditerStore, ['updatedAt']),
  },
  watch: {
    selectedKeys: {
      async handler() {
        await this.draw()
        this.updatedAt = Date.now()
      },
      deep: true,
    },
  },
  methods: {
    async draw() {
      const bodyImg = await this.loadImage(
        `images/body/${this.selectedKeys.body}.png`,
      )
      const hairImg = await this.loadImage(
        `images/hair/${this.selectedKeys.hair}.png`,
      )

      this.composite.canvas().width = bodyImg.naturalWidth
      this.composite.canvas().height = bodyImg.naturalHeight
      this.composite.g2d().drawImage(bodyImg, 0, 0)
      this.composite.g2d().drawImage(hairImg, 0, 0)

      this.composite.texture().source.update()
      this.updatedAt = Date.now()
    },
    async loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
          resolve(image)
        }
        image.onerror = (error) => {
          console.log('image load error', src, error)
          reject(error)
        }
        image.src = src
      })
    },
  },
}
</script>
