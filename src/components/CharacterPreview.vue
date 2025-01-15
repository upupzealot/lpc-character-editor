<template>
  <PartSelectorPanel :size="32" :scale="2"></PartSelectorPanel>

  <AnimationPreview :size="32" :scale="4"></AnimationPreview>

  <ActionSelector :size="32" :scale="2"></ActionSelector>

  <div
    v-for="action in actions"
    :key="action.name"
    class="action-btn"
    @click="selectAction(action)"
  >
    {{ action.name }}
  </div>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'
import AnimationPreview from '@/components/ActionPreview.vue'
import ActionSelector from '@/components/ActionSelector.vue'
import actions from '@/components/CharacterActions.json'
import ImageComposite from '@/components/ImageComposite.vue'
import PartSelectorPanel from '@/components/PartSelectorPanel.vue'

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
  extends: ImageComposite,
  data() {
    return {
      actions,
    }
  },
  components: { PartSelectorPanel, AnimationPreview, ActionSelector },
  async created() {
    await this.draw()
  },
  computed: {
    ...mapWritableState(useEditerStore, ['action']),
  },
  methods: {
    selectAction(action: Action) {
      this.action = action.name
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
