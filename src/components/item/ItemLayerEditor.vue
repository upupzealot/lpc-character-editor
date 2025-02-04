<template>
  <div class="step">
    <a-button :type="btnType(tileImage)" shape="circle">1</a-button
    ><span class="title">{{ `current ${state.opPart} tile` }}</span>
    <div class="content">
      <TileSelecter ref="tileImageSelecter" v-model="tileImage"></TileSelecter>
      <a-button @click="$refs.tileImageSelecter!.openSelecter()">
        reselect
      </a-button>
    </div>
  </div>

  <div class="step">
    <a-button :type="btnType(body)" shape="circle">2</a-button
    ><span class="title">select body data</span>
    <div class="content">
      <!-- <img ref="bodyPreview" class="preview-img" /> -->
      <a-select v-model:value="body">
        <a-select-option value="body-1">body-1</a-select-option>
      </a-select>
    </div>
  </div>

  <div class="step">
    <a-button :type="btnType(layerImage)" shape="circle">3</a-button
    ><span class="title">Generate {{ state.opPart }} layer</span>
    <div class="content">
      <img
        ref="layerPreview"
        class="preview-img"
        :style="{
          display: layerImage ? 'block' : 'none',
        }"
      />
      <a-button :disabled="!generateReady" @click="generateLayer"
        >generate</a-button
      >
      <a-button :disabled="!layerImage" @click="downloadTileImage">
        export
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./EditorCommon.less);
.preview-img {
  image-rendering: pixelated;
}
</style>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import EditorCommon from '@/components/item/EditorCommon.vue'
import TileSelecter from '@/components/item/TileSelecter.vue'
import { makeWeaponLayer } from '@/util/ItemUtil'
import { loadImage } from '@/util/GraphicUtil'

export default {
  extends: EditorCommon,
  components: { TileSelecter },
  computed: {
    ...mapState(useItemEditerStore, [
      'tileImage',
      'tileDataImage',
      'tileData',
      'state',
      'itemMapGroup',
    ]),
    ...mapWritableState(useItemEditerStore, ['body', 'layerImage']),
    generateReady() {
      return !!this.tileImage && !!this.body
    },
  },
  methods: {
    async generateLayer() {
      const bodyItem = this.itemMapGroup['body'][this.body]
      if (
        !this.tileImage ||
        !(this.tileDataImage || this.tileData) ||
        !bodyItem
      )
        return

      const handDataImageUrl = `images/body/${bodyItem.image}`.replace(
        '.png',
        '.handdata.png',
      )
      const handDataImage = await loadImage(handDataImageUrl)

      const { dataUrl } = await makeWeaponLayer(
        32,
        handDataImage,
        this.tileImage,
        this.tileData || this.tileImage,
      )
      const layerImage = this.$refs.layerPreview as HTMLImageElement
      layerImage.src = dataUrl
      this.layerImage = layerImage
    },
    downloadTileImage() {
      if (!this.$refs.layerPreview) return
      this.downloadImage(this.$refs.layerPreview as HTMLImageElement)
    },
  },
}
</script>
