<template>
  <div ref="pixiRoot"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application } from 'pixi.js'
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import PixiPixelComponent from '@/components/PixiPixelComponent.vue'
import CharactorActionSheet from './CharactorActionSheet'

export default {
  extends: PixiPixelComponent,
  computed: {
    ...mapState(useEditerStore, ['state', 'action']),
    ...mapWritableState(useEditerStore, ['direction']),
    canvasWidth() {
      return this.gridSize * 4
    },
    frameSize() {
      return this.state.frameSize
    },
  },
  watch: {
    async direction() {
      await this.update()
    },
    async action() {
      await this.update()
    },
    async frameSize() {
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
