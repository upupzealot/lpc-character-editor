<template>
  <AnimationPreview :mode="'Single'" :size="32" :scale="4"></AnimationPreview>

  <AnimationPreview :mode="'Direction'" :size="32" :scale="2"></AnimationPreview>

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
import AnimationPreview from '@/components/AnimationPreview.vue'
import actions from '../components/CharacterActions.json'
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
  components: { AnimationPreview },
  methods: {
    previewAction(action: Action) {
      console.log(action.name)
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
