<template>
  <div ref="pixiRoot"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application } from 'pixi.js'
import { mapState } from 'pinia'
import { useGraphicsStore } from '@/stores/graphics'
import { useEditerStore } from '@/stores/editor'
import PixiPixelComponent from '@/components/PixiPixelComponent.vue'
import CharactorActionSheet from './CharactorActionSheet'

export default {
  extends: PixiPixelComponent,
  computed: {
    ...mapState(useGraphicsStore, ['compositeAt']),
    ...mapState(useEditerStore, ['direction', 'action']),
    previewScale() {
      return this.state.previewScale
    },
    previewSpeed() {
      return this.state.previewSpeed
    },
  },
  watch: {
    async previewScale() {
      await this.update()
    },
    async previewSpeed() {
      await this.update()
    },
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

      const characterSheet = new CharactorActionSheet(
        this.composite.texture(),
        this.state.frameSize,
      )
      await characterSheet.parse()

      const sprite = new AnimatedSprite(
        characterSheet.animations[`${this.action}(${this.direction})`],
      )
      sprite.roundPixels = true
      sprite.animationSpeed = (1 / 60) * this.state.previewSpeed
      sprite.play()

      sprite.anchor = 0.5
      sprite.x = app.canvas.width / 2
      sprite.y = app.canvas.height / 2
      sprite.scale = this.state.previewScale
      app.stage.addChild(sprite)
    },
  },
}
</script>
