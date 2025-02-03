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
      <a-steps
        type="navigation"
        v-model:current="currentStep"
        :items="steps"
        style="margin-bottom: 10px"
      >
      </a-steps>

      <div v-show="currentStep === 0">
        <DetailRadio :options="options" v-model="mode"></DetailRadio>
        <a-divider style="margin-top: 10px"></a-divider>
        <div class="panel" v-show="mode === 'mini'">
          <MiniTileEditor @next-step="currentStep++"></MiniTileEditor>
        </div>
        <div class="panel" v-show="mode === 'full'">
          <ItemTileEditor @next-step="currentStep++"></ItemTileEditor>
        </div>
      </div>

      <div v-show="currentStep === 1">
        <ItemLayerEditor @next-step="currentStep++"></ItemLayerEditor>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import DetailRadio from '@/components/item/DetailRadio.vue'
import MiniTileEditor from '@/components/item/MiniTileEditor.vue'
import ItemTileEditor from '@/components/item/ItemTileEditor.vue'
import ItemLayerEditor from '@/components/item/ItemLayerEditor.vue'

export default {
  components: { DetailRadio, MiniTileEditor, ItemTileEditor, ItemLayerEditor },
  data() {
    return {
      currentStep: 0,
      steps: [
        {
          title: `Create item`,
        },
        {
          title: `Genarate layer`,
        },
        {
          title: 'Save / Export',
        },
      ],
      mode: 'mini',
      options: [
        {
          value: 'mini',
          label: 'from minimum',
          desc: 'create item from minimum weapon tile image',
        },
        {
          value: 'full',
          label: 'import exist',
          desc: 'import exist weapon tile',
        },
      ],
    } as {
      currentStep: number
      steps: { title: string }[]
      mode: string
      options: { value: string; label: string; desc: string }[]
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
.panel {
  margin-top: 10px;
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
