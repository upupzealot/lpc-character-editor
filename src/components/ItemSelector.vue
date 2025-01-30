<template>
  <div class="wrapper" v-if="opPartKey">
    <div class="title">{{ opPartKey }}: {{ opItem.name }}</div>
    <div class="item-list">
      <div
        v-for="(item, i) in opPartItems"
        :key="item.key"
        :class="item.key === opItemKey ? ['item', 'selected'] : ['item']"
        :style="{
          ...styleObj,
          backgroundPositionX: `-${iconsize * i}px`,
        }"
        @click="selectItem(item.key)"
      >
        <!-- {{ item.name }} -->
      </div>
    </div>
    <PaletteSelector
      :v-show="opItemKey !== 'none'"
      :size="size"
      :scale="scale"
      :itemImageUrl="itemImageUrl"
      ref="paletteSelector"
    ></PaletteSelector>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useCharacterEditerStore } from '@/stores/characterEditor'
import { loadImage } from '@/util/GraphicUtil'
import PaletteSelector from '@/components/PaletteSelector.vue'
import { makeWeaponLayer, makeWeaponTile } from '@/util/ItemUtil'

export default {
  components: { PaletteSelector },
  props: {
    size: {
      type: Number,
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
  },
  data() {
    const canvasUrlMap = {} as { [k: string]: string }
    return {
      canvasUrlMap,
      canvasUrl: 'none',
    }
  },
  computed: {
    ...mapState(useCharacterEditerStore, [
      'itemListGroup',
      'itemMapGroup',
      'state',
      'opPartKey',
      'opPartItems',
      'opItemKey',
      'opItem',
      'selections',
      'selectedPaletteIndex',
    ]),
    iconsize() {
      if (this.size <= 64) {
        return 64
      } else {
        return this.size
      }
    },
    styleObj() {
      return {
        width: `${this.iconsize}px`,
        height: `${this.iconsize}px`,
        backgroundImage: this.canvasUrl,
      }
    },
    itemImageUrl() {
      let imageUrl = ''
      if (this.opItem.image) {
        imageUrl = `/images/${this.opPartKey}/${this.opItem.image}`
      }
      return imageUrl
    },
  },
  watch: {
    opPartKey: {
      async handler(partKey) {
        let url = this.canvasUrlMap[partKey]
        if (!url) {
          url = await this.getCanvasUrl(this.opPartKey)
          this.canvasUrlMap[partKey] = url
        }
        this.canvasUrl = url
      },
      immediate: true,
    },
  },
  methods: {
    async selectItem(itemkey: string) {
      const partKey = this.opPartKey
      if (partKey === 'weapon' && itemkey !== 'none') {
        const item = this.itemMapGroup[partKey][itemkey]
        const imageUrl = `/images/${partKey}/${item.image}`
        const miniImage = await loadImage(imageUrl.replace('.png', '.mini.png'))
        const miniDataImage = await loadImage(
          imageUrl.replace('.png', '.minidata.png'),
        )
        // 不同朝向的瓦片和数据
        const weaponTile = await makeWeaponTile(
          this.size,
          miniImage,
          miniDataImage,
        )

        const bodyItem =
          this.itemMapGroup['body'][this.selections['body'].itemKey]
        const bodyImageUrl = `/images/body/${bodyItem.image}`
        const bodyDataImage = await loadImage(
          bodyImageUrl.replace('.png', '.handdata.png'),
        )
        const frameSize = await makeWeaponLayer(
          this.size,
          bodyDataImage,
          weaponTile,
        )
        this.state.frameSize = frameSize
      }

      this.state.opItem = itemkey
      const newItem = this.itemMapGroup[this.opPartKey][itemkey]
      if (newItem.key !== 'none') {
        const oldPalettes = this.selections[this.opPartKey].palettes
        const newPalettes = newItem.palettes
        const resPalettes = [...newPalettes]
        for (let i = 0; i < resPalettes.length && i < oldPalettes.length; i++) {
          resPalettes[i] = oldPalettes[i]
        }

        this.selections[this.opPartKey].palettes = resPalettes
      }

      if (this.selectedPaletteIndex >= newItem.palettes.length) {
        this.state.opPaletteIndex = 0
      }
      this.selections[this.opPartKey].itemKey = itemkey
    },
    async getCanvasUrl(partKey: string) {
      const items = this.itemListGroup[partKey]
      const canvas = document.createElement('canvas')
      canvas.width = this.iconsize * items.length
      canvas.height = this.iconsize
      const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        let imageUrl = '/images/none.png'
        if (item.image) {
          imageUrl = `/images/${partKey}/${item.image}`
        }
        const image = await loadImage(imageUrl)
        g2d.imageSmoothingEnabled = false
        g2d.drawImage(
          image,
          0, // TODO 使用 _part_config_ 里面的信息
          0, // TODO 使用 _part_config_ 里面的信息
          this.size, // TODO 使用 _part_config_ 里面的信息
          this.size, // TODO 使用 _part_config_ 里面的信息
          i * this.iconsize,
          0,
          this.iconsize,
          this.iconsize,
        )
      }

      return `url(${canvas.toDataURL('image/png')})`
    },
  },
}
</script>

<style scoped>
.wrapper {
  background-color: lightblue;
}
.title {
  height: 16px;
  padding: 5px 10px 0px 10px;
}
.item-list {
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -5px;
}
.item {
  margin: 5px;
  padding: -5px;
  border: transparent 2px solid;

  background-color: aliceblue;
  image-rendering: pixelated;

  cursor: pointer;
}
.item.selected {
  border: black 2px solid;
}
</style>
