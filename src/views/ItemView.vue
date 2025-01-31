<template>
  <div class="wrapper">
    <div class="left">
      <a-menu
        theme="light"
        mode="vertical"
        :selected-keys="[state.opPart]"
        @select="onMenuSelect"
      >
        <a-divider>Body Parts</a-divider>
        <a-menu-item key="hair" :disabled="true"> hair </a-menu-item>
        <a-menu-item key="eye" :disabled="true"> eye </a-menu-item>
        <a-menu-item key="ear" :disabled="true"> ear </a-menu-item>
        <a-divider>Equipments</a-divider>
        <a-menu-item key="upper" :disabled="true"> upper </a-menu-item>
        <a-menu-item key="lower" :disabled="true"> lower </a-menu-item>
        <a-menu-item key="weapon"> weapon </a-menu-item>
      </a-menu>
    </div>
    <div class="content">
      <input
        ref="miniTileInput"
        type="file"
        accept=".png"
        @change="tileSelected('mini')"
        hidden="hidden"
      />
      <img
        ref="miniTilePreview"
        :class="miniTileImage ? 'preview-img' : ['preview-img', 'hidden']"
      />
      <input
        ref="fullTileInput"
        type="file"
        accept=".png"
        @change="tileSelected('full')"
        hidden="hidden"
      />
      <img
        ref="fullTilePreview"
        class="preview-img"
        :class="fullTileImage ? 'preview-img' : ['preview-img', 'hidden']"
      />
      <a-button @click="uploadTile('mini')">
        upload minimum {{ state.opPart }} tile
      </a-button>
      /
      <a-button @click="uploadTile('full')">
        upload {{ state.opPart }} tile
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'

export default {
  data() {
    return {
      miniTileImage: null,
      fullTileImage: null,
    } as {
      miniTileImage: null | HTMLImageElement
      fullTileImage: null | HTMLImageElement
    }
  },
  computed: {
    ...mapState(useItemEditerStore, ['state']),
  },
  methods: {
    onMenuSelect({ key }: { key: string }) {
      this.state.opPart = key
      console.log(this.state, key)
    },
    uploadTile(type: 'mini' | 'full') {
      const $input =
        type === 'mini'
          ? (this.$refs.miniTileInput as HTMLInputElement)
          : (this.$refs.fullTileInput as HTMLInputElement)
      $input.click()
    },
    tileSelected(type: 'mini' | 'full') {
      const $input =
        type === 'mini'
          ? (this.$refs.miniTileInput as HTMLInputElement)
          : (this.$refs.fullTileInput as HTMLInputElement)
      const file = $input.files?.length && $input.files[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          const $preview =
            type === 'mini'
              ? (this.$refs.miniTilePreview as HTMLImageElement)
              : (this.$refs.fullTilePreview as HTMLImageElement)
          if (type === 'mini') {
            this.miniTileImage = $preview
          } else {
            this.fullTileImage = $preview
          }
          $preview.src = reader.result as string
        }

        reader.readAsDataURL(file)
      }
    },
  },
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.left {
  width: 160px;
  flex-grow: 0;
}
.content {
  padding: 15px;

  flex-grow: 1;
}
.preview-img {
  image-rendering: pixelated;
  display: block;
  border: black 2px solid;
  margin-bottom: 10px;
}
.preview-img.hidden {
  display: none;
}
</style>
