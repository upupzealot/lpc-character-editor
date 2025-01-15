<template>
  <div class="button" @click="focusPart">
    <div class="title">{{ keyName }}</div>
    <div class="content">
      <div
        class="icon"
        :style="{ width: `${iconsize}px`, height: `${iconsize}px` }"
      ></div>
      <div class="setting">
        <div class="select">{{ selectedItems[keyName].name }}</div>
        <div class="palette">
          <div class="color-box" style="background-color: coral"></div>
          <div class="color-box" style="background-color: coral"></div>
          <div class="color-box" style="background-color: coral"></div>
          <div class="color-box" style="background-color: coral"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useEditerStore } from '@/stores/editor'

export default {
  props: {
    keyName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState(useEditerStore, ['selectedItems']),
    ...mapWritableState(useEditerStore, ['editPart']),
    iconsize() {
      if (this.size <= 32) {
        return 32
      } else {
        return this.size
      }
    },
  },
  methods: {
    focusPart() {
      this.editPart = this.keyName
    },
  },
}
</script>

<style scoped>
.button {
  background-color: white;

  font-size: 14px;
  cursor: pointer;
}
.title {
  height: 16px;
  padding: 5px 10px 0px 10px;
}
.content {
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
}
.setting {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}
.select {
  height: 20px;
}
.icon {
  background-color: lightblue;
}
.palette {
  display: flex;
  flex-direction: row;
}
.color-box {
  height: 12px;
  width: 12px;
}
</style>
