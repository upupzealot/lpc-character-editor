<template>
  <div class="step">
    <a-button :type="tileImage ? 'primary' : 'default'" shape="circle"
      >1</a-button
    ><span class="title">{{ tileImageBtnText }}</span>
    <div class="content">
      <TileSelecter ref="tileImageSelecter" v-model="tileImage"></TileSelecter>
      <a-button @click="$refs.tileImageSelecter!.openSelecter()">
        upload
      </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="tileDataImage ? 'primary' : 'default'" shape="circle"
      >2</a-button
    ><span class="title">{{ tileDataImageBtnText }}</span>
    <div class="content">
      <TileSelecter
        ref="tileDataImageSelecter"
        v-model="tileDataImage"
      ></TileSelecter>
      <a-button @click="$refs.tileDataImageSelecter!.openSelecter()">
        upload
      </a-button>
      <a-button disabled> create </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="'default'" shape="circle">3</a-button
    ><span class="title">Genarate {{ state.opPart }} title</span>
    <div class="content">
      <div ref="tilePreview"></div>
      <a-button :disabled="!tileImage || !tileDataImage" @click="generateTile">
        generate
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.step {
  margin: 10px 0;
}
.step .title {
  margin-left: 10px;
}
.step .content {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import TileSelecter from '@/components/item/TileSelecter.vue'
import { makeWeaponTile } from '@/util/ItemUtil'

export default {
  components: { TileSelecter },
  data() {
    return {
      tileImage: null,
      tileDataImage: null,
    } as {
      tileImage: HTMLImageElement | null
      tileDataImage: HTMLImageElement | null
    }
  },
  computed: {
    ...mapState(useItemEditerStore, ['state']),
    tileImageBtnText() {
      return `upload minimum ${this.state.opPart} tile image`
    },
    tileDataImageBtnText() {
      return `upload minimum ${this.state.opPart} tile data image`
    },
  },
  methods: {
    async generateTile() {
      if (!this.tileImage || !this.tileDataImage) return

      // 不同朝向的瓦片和数据
      const weaponTile = await makeWeaponTile(
        32,
        this.tileImage,
        this.tileDataImage,
      )
      ;(this.$refs.tilePreview as HTMLElement).replaceChildren(weaponTile.image)
    },
  },
}
</script>
