<template>
  <div class="step">
    <a-button :type="btnType(miniTileImage)" shape="circle">1</a-button
    ><span class="title">{{
      `import minimum ${state.opPart} tile image`
    }}</span>
    <div class="content">
      <TileSelecter
        ref="tileImageSelecter"
        v-model="miniTileImage"
      ></TileSelecter>
      <a-button @click="$refs.tileImageSelecter!.openSelecter()">
        import
      </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="btnType(miniTileDataImage)" shape="circle">2</a-button
    ><span class="title">{{
      `import minimum ${state.opPart} tile data image`
    }}</span>
    <div class="content">
      <TileSelecter
        ref="miniTileDataImageSelecter"
        v-model="miniTileDataImage"
      ></TileSelecter>
      <a-button @click="$refs.miniTileDataImageSelecter!.openSelecter()">
        import
      </a-button>
      <a-button disabled> create </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="btnType(tile.image)" shape="circle">3</a-button
    ><span class="title">Generate {{ state.opPart }} tile</span>
    <div class="content">
      <div
        ref="previewTileImage"
        class="preview-img"
        :style="{
          display: tile.image ? 'block' : 'none',
        }"
      ></div>
      <div
        ref="previewTileDataImage"
        class="preview-img"
        :style="{
          display: tile.dataImage ? 'block' : 'none',
        }"
      ></div>
      <div class="row">
        <div class="col">
          <a-button :disabled="!generateReady" @click="generateTile">
            generate
          </a-button>
          <a-button :disabled="!tile.image" @click="downloadTileImage">
            export tile image
          </a-button>
          <a-button :disabled="!tile.dataImage" @click="downloadTileDataImage">
            export data image
          </a-button>
        </div>
        <a-button
          type="primary"
          :disabled="!tile.image || !tile.dataImage"
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
import TileSelecter from '@/components/item/TileSelecter.vue'
import { makeItemTile } from '@/util/ItemUtil'

export default {
  extends: EditorCommon,
  components: { TileSelecter },
  data() {
    return {
      miniTileImage: null,
      miniTileDataImage: null,
    } as {
      miniTileImage: HTMLImageElement | null
      miniTileDataImage: HTMLImageElement | null
    }
  },
  computed: {
    ...mapState(useItemEditerStore, ['state']),
    ...mapWritableState(useItemEditerStore, ['tile']),
    generateReady() {
      return !!this.miniTileImage && !!this.miniTileDataImage
    },
  },
  methods: {
    async generateTile() {
      if (!this.miniTileImage || !this.miniTileDataImage) return

      // 不同朝向的瓦片和数据
      const itemTile = await makeItemTile(
        32,
        this.miniTileImage,
        this.miniTileDataImage,
      )
      this.tile = itemTile
      ;(this.$refs.previewTileImage as HTMLElement).replaceChildren(
        itemTile.image,
      )
      ;(this.$refs.previewTileDataImage as HTMLElement).replaceChildren(
        itemTile.dataImage,
      )
    },
    downloadTileImage() {
      if (!this.$refs.previewTileImage) return
      const img = (this.$refs.previewTileImage as HTMLElement).querySelector(
        'img',
      )
      this.downloadImage(
        img as HTMLImageElement,
        `${this.state.opPart}.tile.png`,
      )
    },
    downloadTileDataImage() {
      if (!this.$refs.previewTileDataImage) return
      const img = (
        this.$refs.previewTileDataImage as HTMLElement
      ).querySelector('img')
      this.downloadImage(
        img as HTMLImageElement,
        `${this.state.opPart}.tiledata.png`,
      )
    },
  },
}
</script>
