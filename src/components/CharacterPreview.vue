<template>
  <AnimationPreview :size="32" :scale="4"></AnimationPreview>

  <ActionSelector :size="32" :scale="2"></ActionSelector>

  <div
    v-for="action in actions"
    :key="action.name"
    class="action-btn"
    @click="previewAction(action)"
  >
    {{ action.name }}
  </div>
</template>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import AnimationPreview from '@/components/ActionPreview.vue'
import ActionSelector from '@/components/ActionSelector.vue'
import actions from '@/components/CharacterActions.json'

// idle: 4
// walk: 4
// idle-combat: 4
// combat-slash: 2
// combat-stub: 2
// combat-shoot: 2
// combat-fire: 2
// combat-cast: 2
// dead: 2

type Action = {
  name: string
  direction: string
}

export default {
  data() {
    return {
      actions,
    }
  },
  components: { AnimationPreview, ActionSelector },
  async created() {
    const bodyImg = await this.loadImage('images/body/body-1.png')
    const hairImg = await this.loadImage('images/hair/hair-1.png')

    this.canvas.width = bodyImg.naturalWidth
    this.canvas.height = bodyImg.naturalHeight
    this.g2d.drawImage(bodyImg, 0, 0)
    this.g2d.drawImage(hairImg, 0, 0)
    this.updatedAt = Date.now()
  },
  computed: {
    ...mapState(useEditerStore, ['canvas', 'g2d', 'updatedAt']),
    ...mapWritableState(useEditerStore, ['action']),
  },
  methods: {
    previewAction(action: Action) {
      this.action = action.name
    },
    async loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
          resolve(image)
        }
        image.onerror = (error) => {
          console.log('image load error', src, error)
          reject(error)
        }
        image.src = src
      })
    },
  },
}
</script>

<style scoped>
.action-btn {
  margin: 5px;
  background-color: aliceblue;
  border-radius: 2px;
  cursor: pointer;
}
</style>
