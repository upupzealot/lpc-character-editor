<template class="wrapper">
  <div ref="animationPreview"></div>
</template>

<script lang="ts">
import { AnimatedSprite, Application, Assets } from 'pixi.js'
import CharactorActionSheet from './CharactorActionSheet'

export default {
  data() {
    return {
      aaa: 'Hello world!',
    }
  },
  async mounted() {
    const $el = this.$refs.animationPreview as HTMLDivElement

    await this.initPixi($el)
  },
  methods: {
    async initPixi($root: HTMLElement) {
      const app = new Application()
      await app.init({ background: 'lightgrey', width: 200, height: 200 })
      $root.appendChild(app.canvas)

      const texture = await Assets.load('images/body.png')

      const character = new CharactorActionSheet(texture)
      await character.parse()
      const walk = new AnimatedSprite(character.animations['spellcast[up]'])
      walk.animationSpeed = (1 / 60) * 10
      walk.play()

      walk.anchor.set(0.5)
      walk.x = app.screen.width / 2
      walk.y = app.screen.height / 2
      app.stage.addChild(walk)
    },
  },
}
</script>
