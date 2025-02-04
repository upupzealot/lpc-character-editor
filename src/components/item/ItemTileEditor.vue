<template>
  <div class="step">
    <a-button :type="btnType(tile.imageUrl)" shape="circle">1</a-button
    ><span class="title">{{
      `import existed ${state.opPart} tile image`
    }}</span>
    <div class="content">
      <TileSelecter ref="tileImageSelecter" v-model="tile.image"></TileSelecter>
      <TileSelecter
        ref="tileDataImageSelecter"
        v-model="tile.dataImage"
      ></TileSelecter>
      <div class="row">
        <div class="col">
          <a-button @click="$refs.tileImageSelecter!.openSelecter()">
            import tile image
          </a-button>
          <a-button @click="$refs.tileDataImageSelecter!.openSelecter()">
            import data image
          </a-button>
        </div>
        <a-button
          type="primary"
          :disabled="!tile.image"
          @click="$emit('switchMode')"
        >
          Go to generate layer
        </a-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(@/components/item/EditorCommon.less);
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
