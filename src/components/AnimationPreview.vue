<template>
  <div ref="animationPreview"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application, Assets, TextureSource } from 'pixi.js'
import CharactorActionSheet from './CharactorActionSheet'

export default {
  async mounted() {
    // https://github.com/loksland/pixel-art-game-test
    TextureSource.defaultOptions.scaleMode = 'nearest'

    const $el = this.$refs.animationPreview as HTMLDivElement
    await this.initPixi($el)
  },
  methods: {
    async initPixi($root: HTMLElement) {
      const app = new Application()
      await app.init({
        background: 'lightgrey',
        width: 64 * 4,
        height: 64,
      })
      $root.appendChild(app.canvas)

      const texture = await Assets.load('images/body-16.png')
      app.canvas.style.imageRendering = 'pixelated'

      const character = new CharactorActionSheet(texture)
      await character.parse()
      const directions = ['down', 'left', 'right', 'up']
      directions.forEach((dirction, i) => {
        const sprite = new AnimatedSprite(character.animations[`walk(${dirction})`])
        sprite.roundPixels = true
        sprite.animationSpeed = (1 / 60) * 8
        sprite.play()

        sprite.x = i * 64
        sprite.y = 0
        sprite.scale = 2
        app.stage.addChild(sprite)
      })
    },
  },
}
</script>
