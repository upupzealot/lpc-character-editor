<template>
  <div class="wrapper">
    <a-menu
      theme="light"
      mode="vertical"
      :selected-keys="[state.opPart]"
      @select="onMenuSelect"
    >
      <a-divider>Body Parts</a-divider>
      <a-menu-item key="hair" :disabled="true"> hair </a-menu-item>
      <a-menu-item key="eye" :disabled="true"> eye </a-menu-item>
      <a-menu-item key="ear" :disabled="true"> ear </a-menu-item>
      <a-divider>Equipments</a-divider>
      <a-menu-item key="upper" :disabled="true"> upper </a-menu-item>
      <a-menu-item key="lower" :disabled="true"> lower </a-menu-item>
      <a-menu-item key="weapon"> weapon </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'

export default {
  computed: {
    ...mapState(useItemEditerStore, ['state']),
  },
  methods: {
    onMenuSelect({ key }: { key: string }) {
      this.state.opPart = key
      console.log(this.state, key)
    },
  },
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  direction: row;
}
</style>
