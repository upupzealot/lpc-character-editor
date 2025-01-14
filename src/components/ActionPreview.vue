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
    ...mapState(useEditerStore, ['direction', 'action']),
    gridSize() {
      return this.size * this.scale
    },
  },
  watch: {
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
