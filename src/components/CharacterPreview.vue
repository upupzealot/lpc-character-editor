<template>
  <AnimationPreview></AnimationPreview>

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
import actions from '../components/CharacterActions.json5'

export default {
  data() {
    return {
      actions,
    }
  },
  components: { AnimationPreview },
  methods: {
    previewAction(action) {
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
