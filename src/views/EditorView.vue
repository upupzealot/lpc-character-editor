<template class="wrapper">
  <div class="side-bar">
    <PartSelectorBtn :part-key="'body'" :size="32" :scale="2"></PartSelectorBtn>
    <PartSelectorBtn :part-key="'hair'" :size="32" :scale="2"></PartSelectorBtn>
    <PartSelectorBtn
      :part-key="'shirt'"
      :size="32"
      :scale="2"
    ></PartSelectorBtn>
  </div>
  <div class="center">
    <CharacterPreview></CharacterPreview>
  </div>
  <div class="side-bar">Right</div>
</template>

<script lang="ts">
import CharacterPreview from '@/components/CharacterPreview.vue'
import PartSelectorBtn from '@/components/PartSelectorBtn.vue'

export default {
  components: { CharacterPreview, PartSelectorBtn },
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
