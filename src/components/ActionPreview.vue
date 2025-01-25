<template>
  <div ref="pixiRoot"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application, Spritesheet } from 'pixi.js'
import { mapState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import PixiPixelComponent from '@/components/PixiPixelComponent.vue'

export default {
  extends: PixiPixelComponent,
  computed: {
    ...mapState(useEditerStore, ['state', 'direction', 'action']),
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
  },
  async mounted() {
    await this.initPixi()
    await this.update()
  },
  methods: {
    async update() {
      const app = this.ctx.app!() as Application
      app.stage.removeChildren()

      const characterSheet = this.ctx.characterSheet!() as Spritesheet
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
