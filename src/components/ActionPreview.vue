<template>
  <div ref="pixiRoot"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application, Spritesheet } from 'pixi.js'
import { mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import PixiPixelComponent from '@/components/PixiPixelComponent.vue'

export default {
  extends: PixiPixelComponent,
  computed: {
    gridSize() {
      return this.size * this.scale
    },
    ...mapWritableState(useEditerStore, ['direction']),
  },
  watch: {
    async direction() {
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

      const sprite = new AnimatedSprite(characterSheet.animations[`walk(${this.direction})`])
      sprite.roundPixels = true
      sprite.animationSpeed = (1 / 60) * 8
      sprite.play()

      sprite.x = 0
      sprite.y = 0
      sprite.scale = this.scale
      app.stage.addChild(sprite)
    },
  },
}
</script>
