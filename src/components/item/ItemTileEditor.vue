<template>
  <div class="step">
    <a-button :type="btnType(tile.imageUrl)" shape="circle">1</a-button
    ><span class="title">{{
      `import existed ${state.opPart} tile image`
    }}</span>
    <div class="content">
      <TileSelecter ref="tileImageSelecter" v-model="tile.image"></TileSelecter>
      <a-button @click="$refs.tileImageSelecter!.openSelecter()">
        upload
      </a-button>
      <a-button type="primary" :disabled="!tile.imageUrl" @click="nextStep">
        Go to generate full weapon layer
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./EditorCommon.less);
</style>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import EditorCommon from '@/components/item/EditorCommon.vue'
import TileSelecter from '@/components/item/TileSelecter.vue'

export default {
  extends: EditorCommon,
  components: { TileSelecter },
  computed: {
    ...mapState(useItemEditerStore, ['tile', 'state']),
  },
  methods: {
    btnType(value: unknown) {
      return value ? 'primary' : 'default'
    },
  },
}
</script>
