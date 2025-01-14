<template>
  <div ref="animationPreview"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application, Assets, Spritesheet, TextureSource } from 'pixi.js'
import CharactorActionSheet from './CharactorActionSheet'
import { useEditerStore } from '@/stores/editor'
import { mapWritableState } from 'pinia'

export default {
  props: {
    mode: String,
    // size: {
    //   type: Number,
    //   required: true,
    // },
    // scale:  {
    //   type: Number,
    //   required: true,
    // },
  },
  data() {
    return {
      ctx: {},
    } as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx: any
    }
  },
  async mounted() {
    // https://github.com/loksland/pixel-art-game-test
    TextureSource.defaultOptions.scaleMode = 'nearest'

    const $el = this.$refs.animationPreview as HTMLDivElement
    await this.initPixi($el)
  },
  computed: {
    gridWidth() {
      return this.mode === 'Single' ? 1 : 4
    },
    gridSize() {
      return this.size * this.scale
    },
    ...mapWritableState(useEditerStore, ['direction', 'size', 'scale']),
  },
  watch: {
    async direction() {
      await this.update()
    },
  },
  methods: {
    async initPixi($root: HTMLElement) {
      const app = new Application()
      await app.init({
        background: 'lightgrey',
        width: this.gridSize * this.gridWidth,
        height: this.gridSize,
      })
      $root.appendChild(app.canvas)
      this.ctx.app = () => {
        return app
      }

      const texture = await Assets.load('images/body-16.png')
      app.canvas.style.imageRendering = 'pixelated'
      const character = new CharactorActionSheet(texture)
      await character.parse()
      this.ctx.character = () => {
        return character
      }

      await this.update()
    },
    async update() {
      const app = this.ctx.app!() as Application
      app.stage.removeChildren()
      const character = this.ctx.character!() as Spritesheet

      const directions = this.mode === 'Single' ? [this.direction] : ['down', 'left', 'right', 'up']
      directions.forEach((dirction, i) => {
        const sprite = new AnimatedSprite(character.animations[`walk(${dirction})`])
        sprite.roundPixels = true
        sprite.animationSpeed = (1 / 60) * 8
        sprite.play()

        sprite.x = i * this.gridSize
        sprite.y = 0
        sprite.scale = this.scale
        app.stage.addChild(sprite)

        if (this.mode === 'Direction') {
          sprite.eventMode = 'static'
          sprite.on('pointerdown', () => {
            this.direction = dirction
          })
        }
      })
    },
  },
}
</script>
