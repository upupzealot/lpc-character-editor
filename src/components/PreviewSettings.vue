<template>
  <div class="wrapper">
    <div class="scale-selector">
      <div
        v-for="scale in scales"
        :key="scale"
        :class="
          scale === state.previewScale
            ? ['scale-btn', 'selected']
            : ['scale-btn']
        "
        @click="state.previewScale = scale"
      >
        x{{ scale }}
      </div>
    </div>
    <div class="speed-selector">
      <div
        v-for="speed in speeds"
        :key="speed"
        :class="
          speed === state.previewSpeed
            ? ['speed-btn', 'selected']
            : ['speed-btn']
        "
        @click="state.previewSpeed = speed"
      >
        {{ (speed / 8) * 100 }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
}
.scale-selector,
.speed-selector {
  position: absolute;
  display: flex;
  flex-direction: column;
}
.scale-selector {
  right: 10px;
}
.speed-selector {
  left: 10px;
}
.scale-btn,
.speed-btn {
  width: 64px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  border: transparent 2px solid;
  background-color: bisque;
}
.scale-btn.selected,
.speed-btn.selected {
  border: black 2px solid;
}
</style>

<script lang="ts">
import { mapState } from 'pinia'
import { useEditerStore } from '@/stores/editor'

export default {
  data() {
    return {
      scales: [1, 2, 4, 6, 8, 10, 12],
      speeds: [0, 2, 4, 6, 8, 12, 16],
    }
  },
  computed: {
    ...mapState(useEditerStore, ['state']),
    scale() {
      return this.state.previewScale
    },
  },
}
</script>
