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
    ...mapWritableState(useEditerStore, ['direction']),
    canvasWidth() {
      return this.gridSize * 4
    },
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

      const directions = ['down', 'left', 'right', 'up']
      directions.forEach((dirction, i) => {
        const sprite = new AnimatedSprite(characterSheet.animations[`walk(${dirction})`])
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
