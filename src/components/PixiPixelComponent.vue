<script lang="ts">
import { Application } from 'pixi.js'
import { mapState, mapWritableState } from 'pinia'
import { useGraphicsStore } from '@/stores/graphics'
import { useEditerStore } from '@/stores/editor'

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
    ...mapWritableState(useGraphicsStore, ['composite']),
    ...mapState(useEditerStore, ['state', 'direction', 'action']),
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
        resizeTo: $root,
      })
      $root.appendChild(app.canvas)
      app.canvas.style.imageRendering = 'pixelated'
      this.ctx.app = () => {
        return app
      }
    },
  },
}
</script>
