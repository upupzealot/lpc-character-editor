<template>
  <div class="step">
    <a-button :type="btnType(tileset.imageCanvas)" shape="circle">1</a-button
    ><span class="title">{{
      `import existed ${state.opPart} tileset image`
    }}</span>
    <div class="content">
      <PngSelecter
        ref="imageSelecter"
        v-model="tileset.imageCanvas"
      ></PngSelecter>
      <PngSelecter
        ref="dataImageSelecter"
        v-model="tileset.dataCanvas"
        :previewCanvas="tileset.imageCanvas"
      ></PngSelecter>
      <div class="row">
        <div class="col">
          <a-button @click="$refs.imageSelecter!.openSelecter()">
            import tileset image
          </a-button>
          <a-button @click="$refs.dataImageSelecter!.openSelecter()">
            import tileset data image
          </a-button>
        </div>
        <a-button
          type="primary"
          :disabled="!tileset.imageCanvas"
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
    ...mapState(useItemEditerStore, ['tileset', 'state']),
  },
  methods: {
    btnType(value: unknown) {
      return value ? 'primary' : 'default'
    },
  },
}
</script>
