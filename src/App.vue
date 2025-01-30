<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="layout">
      <div class="header">
        <a-menu
          theme="dark"
          mode="horizontal"
          :selected-keys="[currentRoute]"
          @select="onMenuSelect"
        >
          <a-menu-item key="editor"> Editor </a-menu-item>
          <a-menu-item key="tile"> Tile </a-menu-item></a-menu
        >
      </div>
      <div class="body">
        <RouterView />
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    currentRoute() {
      return this.$route.name
    },
  },
  methods: {
    onMenuSelect({ key }: { key: string }) {
      this.$router.push({ name: key })
    },
  },
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: stretch;
}
.layout {
  width: 1000px;

  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.header,
.footer {
  flex-grow: 0;
  min-height: 46px;
  background-color: lightgrey;
}
.nav {
  height: 36px;
  line-height: 36px;
  margin: 10px 5px;
}
.body {
  flex-grow: 1;

  display: flex;
  align-items: stretch;
  flex-direction: row;
  justify-content: center;
}
</style>
