<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="layout">
      <div class="header">
        <div></div>
      </div>
      <div class="body">
        <RouterView />
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>

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
.body {
  flex-grow: 1;

  display: flex;
  align-items: stretch;
  flex-direction: row;
  justify-content: center;
}
</style>
