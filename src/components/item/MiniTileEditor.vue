<template>
  <div class="step">
    <a-button :type="btnType(miniTileImage)" shape="circle">1</a-button
    ><span class="title">{{
      `upload minimum ${state.opPart} tile image`
    }}</span>
    <div class="content">
      <TileSelecter
        ref="tileImageSelecter"
        v-model="miniTileImage"
      ></TileSelecter>
      <a-button @click="$refs.tileImageSelecter!.openSelecter()">
        upload
      </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="btnType(miniTileDataImage)" shape="circle">2</a-button
    ><span class="title">{{
      `upload minimum ${state.opPart} tile data image`
    }}</span>
    <div class="content">
      <TileSelecter
        ref="miniTileDataImageSelecter"
        v-model="miniTileDataImage"
      ></TileSelecter>
      <a-button @click="$refs.miniTileDataImageSelecter!.openSelecter()">
        upload
      </a-button>
      <a-button disabled> create </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="btnType(tileImage)" shape="circle">3</a-button
    ><span class="title">Generate {{ state.opPart }} tile</span>
    <div class="content">
      <div
        ref="tilePreview"
        class="preview-img"
        :style="{
          display: tileImage ? 'block' : 'none',
        }"
      ></div>
      <a-button :disabled="!generateReady" @click="generateTile">
        generate
      </a-button>
      <a-button :disabled="!tileImage" @click="downloadTileImage">
        export
      </a-button>
      <a-button type="primary" :disabled="!tileImage" @click="nextStep">
        Go to generate full weapon layer
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./EditorCommon.less);
</style>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import EditorCommon from '@/components/item/EditorCommon.vue'
import TileSelecter from '@/components/item/TileSelecter.vue'
import { getTileData, makeWeaponTile } from '@/util/ItemUtil'

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
    ...mapWritableState(useItemEditerStore, [
      'tileImage',
      'tileDataImage',
      'tileData',
    ]),
    generateReady() {
      return !!this.miniTileImage && !!this.miniTileDataImage
    },
  },
  emits: ['nextStep'],
  methods: {
    async generateTile() {
      if (!this.miniTileImage || !this.miniTileDataImage) return

      // 不同朝向的瓦片和数据
      const weaponTile = await makeWeaponTile(
        32,
        this.miniTileImage,
        this.miniTileDataImage,
      )
      this.tileImage = weaponTile.image
      this.tileDataImage = weaponTile.dataImage
      const tileData = getTileData(32, this.tileImage, this.tileDataImage)
      this.tileData = tileData
      ;(this.$refs.tilePreview as HTMLElement).replaceChildren(weaponTile.image)
    },
    downloadTileImage() {
      if (!this.$refs.tilePreview) return
      const img = (this.$refs.tilePreview as HTMLElement).querySelector('img')
      this.downloadImage(img as HTMLImageElement)
    },
  },
}
</script>
