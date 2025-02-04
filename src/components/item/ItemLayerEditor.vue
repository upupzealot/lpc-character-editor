<template>
  <div class="step">
    <a-button :type="btnType(tile.image)" shape="circle">1</a-button
    ><span class="title">{{ `current ${state.opPart} tile` }}</span>
    <div class="content">
      <TileSelecter ref="tileImageSelecter" v-model="tile.image"></TileSelecter>
      <TileSelecter
        ref="tileImageDataSelecter"
        v-model="tile.dataImage"
      ></TileSelecter>
      <div class="row">
        <div class="col">
          <a-button @click="$refs.tileImageSelecter!.openSelecter()">
            import tile image
          </a-button>
          <a-button @click="$refs.tileImageDataSelecter!.openSelecter()">
            import data image
          </a-button>
        </div>
        <a-button @click="$emit('switchMode')">
          create item from minimum
        </a-button>
      </div>
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
    <a-button :type="btnType(layer.image)" shape="circle">3</a-button
    ><span class="title">Generate {{ state.opPart }} layer</span>
    <div class="content">
      <img
        ref="previewLayer"
        class="preview-img"
        :style="{
          display: layer.image ? 'block' : 'none',
        }"
      />
      <div class="col">
        <a-button :disabled="!generateReady" @click="generateLayer"
          >generate</a-button
        >
        <a-button :disabled="!layer.image" @click="downloadLayerImage">
          export
        </a-button>
      </div>
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
import { makeItemLayer } from '@/util/ItemUtil'
import { loadImage } from '@/util/GraphicUtil'

export default {
  extends: EditorCommon,
  components: { TileSelecter },
  computed: {
    ...mapState(useItemEditerStore, ['tile', 'layer', 'state', 'itemMapGroup']),
    generateReady() {
      return !!this.tile.image && !!this.layer.body
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

      const { imageUrl } = await makeItemLayer(
        32,
        handDataImage,
        this.tile.image,
        data,
      )
      this.layer.imageUrl = imageUrl
      const layerImage = this.$refs.previewLayer as HTMLImageElement
      layerImage.src = imageUrl
      this.layer.image = layerImage
    },
    downloadLayerImage() {
      if (!this.$refs.layerPreview) return
      const image = this.$refs.layerPreview as HTMLImageElement
      this.downloadImage(image, `${this.state.opPart}.png`)
    },
  },
}
</script>
