<template>
  <div class="wrapper">
    <AnimationPreview
      class="animation-preview"
      :size="frameSize"
      :scale="10"
    ></AnimationPreview>

    <ActionSelector
      class="direction-selector"
      :size="size"
      :scale="2"
    ></ActionSelector>

    <div class="action-selector">
      <div
        v-for="action in actions"
        :key="action.name"
        class="action-btn"
        @click="selectAction(action)"
      >
        {{ action.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'

import AnimationPreview from '@/components/ActionPreview.vue'
import ActionSelector from '@/components/ActionSelector.vue'
import actions from '@/components/CharacterActions.json'
import ImageComposite from '@/components/ImageComposite.vue'

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
  components: {
    AnimationPreview,
    ActionSelector,
  },
  async created() {
    await this.draw()
  },
  computed: {
    ...mapWritableState(useEditerStore, ['state', 'action']),
    frameSize() {
      return this.state.frameSize
    },
  },
  methods: {
    selectAction(action: Action) {
      this.action = action.name
    },
  },
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: stretch;
  width: 100%;
}
.animation-preview {
  flex-grow: 0;
}
.action-selector {
  width: 100%;
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.action-btn {
  height: 16px;
  line-height: 16px;
  padding: 5px 10px;
  margin: 5px;

  background-color: aliceblue;
  border-radius: 2px;
  cursor: pointer;
}
</style>
