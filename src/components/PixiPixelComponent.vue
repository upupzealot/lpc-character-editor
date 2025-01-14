<script lang="ts">
import { Application, Assets, TextureSource } from 'pixi.js'
import CharactorActionSheet from '@/components/CharactorActionSheet'

// https://github.com/loksland/pixel-art-game-test
TextureSource.defaultOptions.scaleMode = 'nearest'

export default {
  props: {
    size: {
      type: Number,
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
  },
  data() {
    // 用于获取非响应式变量
    // 如 app 对象，通过 ()=>{ return app } 来返回
    return {
      ctx: {},
    } as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx: any
    }
  },
  computed: {
    gridSize() {
      return this.size * this.scale
    },
    canvasWidth() {
      return this.gridSize
    },
    canvasHeight() {
      return this.gridSize
    },
  },
  methods: {
    async initPixi() {
      const $root = this.$refs.pixiRoot as HTMLDivElement
      const app = new Application()
      await app.init({
        background: 'lightgrey',
        width: this.canvasWidth,
        height: this.canvasHeight,
      })
      $root.appendChild(app.canvas)
      this.ctx.app = () => {
        return app
      }

      const texture = await Assets.load('images/body-16.png')
      app.canvas.style.imageRendering = 'pixelated'
      const characterSheet = new CharactorActionSheet(texture)
      await characterSheet.parse()
      this.ctx.characterSheet = () => {
        return characterSheet
      }
    },
  },
}
</script>
