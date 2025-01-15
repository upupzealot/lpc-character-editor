<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'

export default {
  computed: {
    ...mapState(useEditerStore, ['composite', 'selectedKeys', 'selectedItems']),
    ...mapWritableState(useEditerStore, ['updatedAt']),
  },
  watch: {
    selectedKeys: {
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
        bodyImg = await this.loadImage(
          `images/body/${this.selectedItems.body.image}`,
        )
      }
      if (hairSrc) {
        hairImg = await this.loadImage(
          `images/hair/${this.selectedItems.hair.image}`,
        )
      }

      const lastImg = bodyImg || hairImg
      if (lastImg) {
        this.composite.canvas().width = lastImg.naturalWidth
        this.composite.canvas().height = lastImg.naturalHeight
      }

      if (bodyImg) {
        this.composite.g2d().drawImage(bodyImg, 0, 0)
      }
      if (hairImg) {
        this.composite.g2d().drawImage(hairImg, 0, 0)
      }

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
