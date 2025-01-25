<template>
  <div class="wrapper">
    <ItemSelector class="item-selector" :size="32" :scale="2"></ItemSelector>

    <PreviewSettings></PreviewSettings>

    <AnimationPreview
      class="animation-preview"
      :size="32"
      :scale="10"
    ></AnimationPreview>

    <ActionSelector
      class="direction-selector"
      :size="32"
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
import PreviewSettings from './PreviewSettings.vue'
import AnimationPreview from '@/components/ActionPreview.vue'
import ActionSelector from '@/components/ActionSelector.vue'
import actions from '@/components/CharacterActions.json'
import ImageComposite from '@/components/ImageComposite.vue'
import ItemSelector from '@/components/ItemSelector.vue'

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
  components: {
    ItemSelector,
    PreviewSettings,
    AnimationPreview,
    ActionSelector,
  },
  async created() {
    await this.draw()
  },
  computed: {
    ...mapWritableState(useEditerStore, ['state', 'action']),
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
.item-selector {
  display: block;
}
.animation-preview {
  flex-grow: 0;
}
.direction-selector {
  flex-grow: 0;
}
.action-selector {
  width: 100%;
  flex-grow: 1;

  display: flex;
  flex-direction: row;
}
.action-btn {
  width: 100px;
  height: 16px;
  line-height: 16px;
  padding: 5px 10px;
  margin: 5px;

  background-color: aliceblue;
  border-radius: 2px;
  cursor: pointer;
}
</style>
