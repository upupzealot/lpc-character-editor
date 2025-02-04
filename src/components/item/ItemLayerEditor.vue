<template>
  <div class="step">
    <a-button :type="btnType(tile.imageUrl)" shape="circle">1</a-button
    ><span class="title">{{ `current ${state.opPart} tile` }}</span>
    <div class="content">
      <TileSelecter ref="tileImageSelecter" v-model="tile.image"></TileSelecter>
      <a-button @click="$refs.tileImageSelecter!.openSelecter()">
        import
      </a-button>
      <a-button @click="$emit('switchMode')"> create new item </a-button>
    </div>
  </div>

  <div class="step">
    <a-button :type="btnType(layer.body)" shape="circle">2</a-button
    ><span class="title">select body data</span>
    <div class="content">
      <!-- <img ref="bodyPreview" class="preview-img" /> -->
      <a-select v-model:value="layer.body">
        <a-select-option value="body-1">body-1</a-select-option>
      </a-select>
    </div>
  </div>

  <div class="step">
    <a-button :type="btnType(layer.imageUrl)" shape="circle">3</a-button
    ><span class="title">Generate {{ state.opPart }} layer</span>
    <div class="content">
      <img
        ref="layerPreview"
        class="preview-img"
        :style="{
          display: layer.imageUrl ? 'block' : 'none',
        }"
      />
      <a-button :disabled="!generateReady" @click="generateLayer"
        >generate</a-button
      >
      <a-button :disabled="!layer.imageUrl" @click="downloadTileImage">
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
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import EditorCommon from '@/components/item/EditorCommon.vue'
import TileSelecter from '@/components/item/TileSelecter.vue'
import { makeWeaponLayer } from '@/util/ItemUtil'
import { loadImage } from '@/util/GraphicUtil'

export default {
  extends: EditorCommon,
  components: { TileSelecter },
  computed: {
    ...mapState(useItemEditerStore, ['tile', 'layer', 'state', 'itemMapGroup']),
    generateReady() {
      return !!this.tile.imageUrl && !!this.layer.body
    },
  },
  methods: {
    async generateLayer() {
      const bodyItem = this.itemMapGroup['body'][this.layer.body]
      const data = this.tile.dataImage || this.tile.data
      if (!(this.tile.image && data && bodyItem)) return

      const handDataImageUrl = `images/body/${bodyItem.image}`.replace(
        '.png',
        '.handdata.png',
      )
      const handDataImage = await loadImage(handDataImageUrl)

      const { imageUrl } = await makeWeaponLayer(
        32,
        handDataImage,
        this.tile.image,
        data,
      )
      this.layer.imageUrl = imageUrl

      const layerImage = this.$refs.layerPreview as HTMLImageElement
      layerImage.src = imageUrl
      this.layer.image = layerImage
    },
    downloadTileImage() {
      if (!this.$refs.layerPreview) return
      this.downloadImage(this.$refs.layerPreview as HTMLImageElement)
    },
  },
}
</script>
