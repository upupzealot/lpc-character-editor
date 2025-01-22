<template class="wrapper">
  <div class="side-bar">
    <PartSelectBtn :part-key="'body'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'hair'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'eye'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'ear'" :size="32" :scale="2"></PartSelectBtn>
  </div>
  <div class="center">
    <CharacterPreview></CharacterPreview>
  </div>
  <div class="side-bar">
    <PartSelectBtn :part-key="'upper'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'lower'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'weapon'" :size="32" :scale="2"></PartSelectBtn>
  </div>
</template>

<script lang="ts">
import CharacterPreview from '@/components/CharacterPreview.vue'
import PartSelectBtn from '@/components/PartSelectBtn.vue'

export default {
  components: { CharacterPreview, PartSelectBtn },
}
</script>

<style scoped>
.side-bar {
  width: 200px;
  flex-grow: 0;
  background-color: aliceblue;

  padding: 15px;
}
.center {
  flex-grow: 1;
  max-width: 600px;
  background-color: white;
}
</style>
