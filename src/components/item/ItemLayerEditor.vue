<template>
  <div class="step">
    <a-button :type="btnType(tileset.imageCanvas)" shape="circle">1</a-button
    ><span class="title">{{ `current ${state.opPart} tileset` }}</span>
    <div class="content">
      <PngSelecter
        ref="imageSelecter"
        v-model="tileset.imageCanvas"
      ></PngSelecter>
      <PngSelecter
        ref="dataImageSelecter"
        v-model="tileset.dataCanvas"
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
        <a-button type="primary" @click="$emit('switchMode')">
          Go to create item from minimum
        </a-button>
      </div>
    </div>
  </div>

  <a-divider></a-divider>

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

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="btnType(layer.canvas)" shape="circle">3</a-button
    ><span class="title">Generate {{ state.opPart }} layer</span>
    <div class="content">
      <img
        ref="previewLayer"
        class="preview-img"
        :style="{
          display: layer.canvas ? 'block' : 'none',
        }"
      />
      <div
        class="preview-json"
        :style="{
          display: layer.canvas ? 'block' : 'none',
        }"
      >
        <ItemLayerDataForm ref="layerDataForm"></ItemLayerDataForm>
      </div>
      <div class="col">
        <a-button :disabled="!generateReady" @click="generateLayer"
          >generate</a-button
        >
        <a-button :disabled="!layer.canvas" @click="downloadLayerImage">
          export image
        </a-button>
        <a-button :disabled="!layer.canvas" @click="downloadLayerDataJson">
          export data
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
import { decodeColor, loadCanvas } from '@/util/GraphicUtil'
import { makeItemLayer } from '@/components/item/maker/LayerMaker'
import EditorCommon from '@/components/item/EditorCommon.vue'
import PngSelecter from '@/components/item/PngSelecter.vue'
import ItemLayerDataForm from '@/components/item/ItemLayerDataForm.vue'

export default {
  extends: EditorCommon,
  components: { PngSelecter, ItemLayerDataForm },
  computed: {
    ...mapState(useItemEditerStore, [
      'tileset',
      'layer',
      'state',
      'itemMapGroup',
    ]),
    generateReady() {
      return !!this.tileset.imageCanvas && !!this.layer.body
    },
  },
  methods: {
    async generateLayer() {
      const bodyItem = this.itemMapGroup['body'][this.layer.body]
      const data = this.tileset.dataCanvas || this.tileset.data
      if (!(this.tileset.imageCanvas && data && bodyItem)) return

      const handDataImageUrl = `images/body/${bodyItem.image}`.replace(
        '.png',
        '.handdata.png',
      )
      const handDataCanvas = await loadCanvas(handDataImageUrl)

      const { canvas, tileSize } = await makeItemLayer(
        32,
        handDataCanvas,
        this.tileset.imageCanvas,
        data,
      )
      const layerImage = this.$refs.previewLayer as HTMLImageElement
      layerImage.src = canvas.toDataURL()
      this.layer.canvas = canvas
      this.layer.data.size = tileSize
    },
    async downloadLayerImage() {
      if (!this.$refs.previewLayer) return

      const error = await (
        this.$refs.layerDataForm as typeof ItemLayerDataForm
      ).validate()
      if (error) return

      const image = this.$refs.previewLayer as HTMLImageElement
      this.downloadImage(image, `${this.layer.data.key}.png`)
    },
    async downloadLayerDataJson() {
      if (!this.$refs.previewLayer) return

      const error = await (
        this.$refs.layerDataForm as typeof ItemLayerDataForm
      ).validate()
      if (error) return

      const { data } = this.layer
      const dataObj = {
        name: data.name,
        key: data.key,
        size: data.size,
        image: `${data.key}.png`,
        palettes: [data.palette1, data.palette2, data.palette3, data.palette4]
          .filter((p) => !!p)
          .map((paletteStr) => {
            return {
              colors: paletteStr.split(';').map(decodeColor),
            }
          }),
      }
      this.downloadJson(dataObj, `${this.layer.data.key}.json`)
    },
  },
}
</script>
