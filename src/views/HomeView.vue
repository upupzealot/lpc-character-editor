<template class="wrapper">
  <div class="side-bar">Left</div>
  <div class="center"></div>
  <div class="side-bar">Right</div>
</template>

<style scoped>
.side-bar {
  width: 200px;
  flex-grow: 0;
  background-color: aliceblue;
}
.center {
  flex-grow: 1;
  max-width: 600px;
  background-color: white;
}
</style>

<script setup lang="ts"></script>
