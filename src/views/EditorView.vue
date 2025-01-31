<template class="wrapper">
  <div class="side-bar pc">
    <PartSelectBtn :part-key="'body'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'hair'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'eye'" :size="32" :scale="2"></PartSelectBtn>
    <PartSelectBtn :part-key="'ear'" :size="32" :scale="2"></PartSelectBtn>
  </div>
  <div class="center">
    <ItemSelector class="item-selector" :size="32" :scale="2"></ItemSelector>
    <CharacterPreview></CharacterPreview>
  </div>
  <div style="display: flex; flex-direction: column">
    <div class="side-bar mobile">
      <PartSelectBtn :part-key="'body'" :size="32" :scale="2"></PartSelectBtn>
      <PartSelectBtn :part-key="'hair'" :size="32" :scale="2"></PartSelectBtn>
      <PartSelectBtn :part-key="'eye'" :size="32" :scale="2"></PartSelectBtn>
      <PartSelectBtn :part-key="'ear'" :size="32" :scale="2"></PartSelectBtn>
    </div>
    <div class="side-bar">
      <PartSelectBtn :part-key="'upper'" :size="32" :scale="2"></PartSelectBtn>
      <PartSelectBtn :part-key="'lower'" :size="32" :scale="2"></PartSelectBtn>
      <PartSelectBtn :part-key="'weapon'" :size="32" :scale="2"></PartSelectBtn>
    </div>
  </div>
</template>

<script lang="ts">
import ItemSelector from '@/components/character/ItemSelector.vue'
import CharacterPreview from '@/components/character/CharacterPreview.vue'
import PartSelectBtn from '@/components/character/PartSelectBtn.vue'

export default {
  components: { ItemSelector, CharacterPreview, PartSelectBtn },
}
</script>

<style scoped>
.side-bar {
  min-width: 85px;
  flex-grow: 0;
  background-color: aliceblue;

  padding: 15px;
  @media screen and (max-width: 600px) {
    padding: 0;
  }
}
.side-bar.pc {
  display: initial;
  @media screen and (max-width: 600px) {
    display: none;
  }
}
.side-bar.mobile {
  display: none;
  @media screen and (max-width: 600px) {
    display: initial;
  }
}
.center {
  flex-grow: 1;
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  @media screen and (max-width: 600px) {
    flex-direction: column-reverse;
  }
}
</style>
