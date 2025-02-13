<template>
  <div class="step">
    <a-button :type="btnType(miniImageCanvas)" shape="circle">1</a-button
    ><span class="title">{{
      `import minimum ${state.opPart} tileset image`
    }}</span>
    <div class="content">
      <PngSelecter ref="imageSelecter" v-model="miniImageCanvas"></PngSelecter>
      <a-button @click="$refs.imageSelecter!.openSelecter()"> import </a-button>
      <AsepriteSelecter ref="aseSelecter" v-model="miniAse"></AsepriteSelecter>
      <a-button @click="$refs.aseSelecter!.openSelecter()">
        import ase (test)
      </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="btnType(miniDataCanvas)" shape="circle">2</a-button
    ><span class="title">{{
      `import minimum ${state.opPart} tileset data image`
    }}</span>
    <div class="content">
      <PngSelecter
        ref="dataImageSelecter"
        v-model="miniDataCanvas"
        :previewCanvas="miniImageCanvas"
      ></PngSelecter>
      <a-button @click="$refs.dataImageSelecter!.openSelecter()">
        import
      </a-button>
      <a-button disabled> create </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="btnType(tileset.imageCanvas)" shape="circle">3</a-button
    ><span class="title">Generate {{ state.opPart }} tileset</span>
    <div class="content">
      <div
        ref="previewImage"
        class="preview-img"
        :style="{
          display: tileset.imageCanvas ? 'block' : 'none',
        }"
      ></div>
      <div
        ref="previewDataImage"
        class="preview-img"
        :style="{
          display: tileset.dataCanvas ? 'block' : 'none',
        }"
      ></div>
      <div class="row">
        <div class="col">
          <a-button :disabled="!generateReady" @click="generateTile">
            generate
          </a-button>
          <a-button :disabled="!tileset.imageCanvas" @click="downloadTileImage">
            export tileset image
          </a-button>
          <a-button
            :disabled="!tileset.dataCanvas"
            @click="downloadTileDataImage"
          >
            export tileset data image
          </a-button>
        </div>
        <a-button
          type="primary"
          :disabled="!tileset.imageCanvas || !tileset.dataCanvas"
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
import { mapState, mapWritableState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import EditorCommon from '@/components/item/EditorCommon.vue'
import PngSelecter from '@/components/item/PngSelecter.vue'
import AsepriteSelecter from '@/components/item/AsepriteSelecter.vue'
import { makeItemTile } from '@/components/item/maker/TilesetMaker'
import type { IAse } from '@/util/AsepriteUtil'

export default {
  extends: EditorCommon,
  components: { PngSelecter, AsepriteSelecter },
  data() {
    return {
      miniImageCanvas: null,
      miniDataCanvas: null,
      miniAse: null,
    } as {
      miniImageCanvas: HTMLCanvasElement | null
      miniDataCanvas: HTMLCanvasElement | null
      miniAse: IAse | null
    }
  },
  computed: {
    ...mapState(useItemEditerStore, ['state']),
    ...mapWritableState(useItemEditerStore, ['tileset']),
    generateReady() {
      return !!this.miniImageCanvas && !!this.miniDataCanvas
    },
  },
  watch: {
    async miniAse() {
      if (this.miniAse) {
        this.miniImageCanvas = this.miniAse.render()

        const dataLayer = this.miniAse.layers.find((layer) =>
          layer.name.startsWith('#'),
        )
        if (dataLayer) {
          this.miniDataCanvas = this.miniAse.render(0, dataLayer.name)
        }
      }
    },
  },
  methods: {
    async generateTile() {
      if (!this.miniImageCanvas || !this.miniDataCanvas) return

      // 不同朝向的瓦片和数据
      const itemTile = await makeItemTile(
        this.state.opPart,
        32,
        this.miniImageCanvas,
        this.miniDataCanvas,
      )
      this.tileset = itemTile
      ;(this.$refs.previewImage as HTMLElement).replaceChildren(
        itemTile.imageCanvas,
      )
      ;(this.$refs.previewDataImage as HTMLElement).replaceChildren(
        itemTile.dataCanvas,
      )
    },
    downloadTileImage() {
      if (!this.$refs.previewImage) return
      const img = (this.$refs.previewImage as HTMLElement).querySelector('img')
      this.downloadImage(
        img as HTMLImageElement,
        `${this.state.opPart}.tile.png`,
      )
    },
    downloadTileDataImage() {
      if (!this.$refs.previewDataImage) return
      const img = (this.$refs.previewDataImage as HTMLElement).querySelector(
        'img',
      )
      this.downloadImage(
        img as HTMLImageElement,
        `${this.state.opPart}.tiledata.png`,
      )
    },
  },
}
</script>
