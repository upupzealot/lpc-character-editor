<template>
  <div ref="pixiRoot"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application } from 'pixi.js'
import { mapState, mapWritableState } from 'pinia'
import { useGraphicsStore } from '@/stores/graphics'
import { useEditerStore } from '@/stores/editor'
import PixiPixelComponent from '@/components/PixiPixelComponent.vue'
import CharactorActionSheet from './CharactorActionSheet'

export default {
  extends: PixiPixelComponent,
  computed: {
    ...mapState(useGraphicsStore, ['compositeAt']),
    ...mapState(useEditerStore, ['action']),
    ...mapWritableState(useEditerStore, ['direction']),
    canvasWidth() {
      return this.gridSize * 4
    },
  },
  watch: {
    async direction() {
      await this.update()
    },
    async action() {
      await this.update()
    },
    async compositeAt() {
      await this.update()
    },
  },
  async mounted() {
    await this.initPixi()
    await this.update()
  },
  methods: {
    async update() {
      const app = this.ctx.app!() as Application
      app.stage.removeChildren()

      app.canvas.width = this.canvasWidth
      app.canvas.height = this.canvasHeight
      app.resize()

      const characterSheet = new CharactorActionSheet(
        this.composite.texture(),
        this.state.frameSize,
      )
      await characterSheet.parse()

      const directions = ['down', 'left', 'right', 'up']
      directions.forEach((dirction, i) => {
        const sprite = new AnimatedSprite(
          characterSheet.animations[`${this.action}(${dirction})`],
        )
        sprite.roundPixels = true
        sprite.animationSpeed = (1 / 60) * 8
        sprite.play()

        sprite.x = i * this.gridSize
        sprite.y = 0
        sprite.scale = this.scale
        app.stage.addChild(sprite)

        sprite.eventMode = 'static'
        sprite.on('pointerdown', () => {
          this.direction = dirction
        })
      })
    },
  },
}
</script>
