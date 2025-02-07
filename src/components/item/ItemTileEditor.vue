<template>
  <div class="step">
    <a-button :type="btnType(tile.imageCanvas)" shape="circle">1</a-button
    ><span class="title">{{
      `import existed ${state.opPart} tile image`
    }}</span>
    <div class="content">
      <PngSelecter
        ref="tileImageSelecter"
        v-model="tile.imageCanvas"
      ></PngSelecter>
      <PngSelecter
        ref="tileDataImageSelecter"
        v-model="tile.dataCanvas"
        :previewCanvas="tile.imageCanvas"
      ></PngSelecter>
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
          :disabled="!tile.imageCanvas"
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
import PngSelecter from '@/components/item/PngSelecter.vue'

export default {
  extends: EditorCommon,
  components: { PngSelecter },
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
