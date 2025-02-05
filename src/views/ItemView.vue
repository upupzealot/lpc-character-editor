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
      <DetailRadio :options="options" v-model="mode"></DetailRadio>

      <div v-show="mode === 'tile'">
        <a-divider style="margin-top: 10px"></a-divider>
        <a-tabs v-model:activeKey="tileMode" type="card">
          <a-tab-pane key="create" tab="Create" force-render>
            <div class="panel" v-show="tileMode === 'create'">
              <MiniTileEditor @switch-mode="mode = 'layer'"></MiniTileEditor>
            </div>
          </a-tab-pane>
          <a-tab-pane key="edit" tab="Edit" force-render>
            <div class="panel" v-show="tileMode === 'edit'">
              <ItemTileEditor @switch-mode="mode = 'layer'"></ItemTileEditor>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div v-show="mode === 'layer'">
        <a-divider style="margin-top: 10px"></a-divider>
        <ItemLayerEditor @switch-mode="mode = 'tile'"></ItemLayerEditor>
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
      mode: 'tile',
      options: [
        {
          value: 'tile',
          label: 'Item Maker',
          desc: 'create item from minimum or edit existed ones',
        },
        {
          value: 'layer',
          label: 'Layer Maker',
          desc: 'create item layer for selected body',
        },
      ],
      tileMode: 'create',
      tileOptions: [
        {
          value: 'create',
          label: 'Create',
          desc: 'create new item from minimum',
        },
        {
          value: 'edit',
          label: 'Edit',
          desc: 'edit existed item',
        },
      ],
    } as {
      mode: string
      options: { value: string; label: string; desc: string }[]
      tileMode: string
      tileOptions: { value: string; label: string; desc: string }[]
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

<style lang="less" scoped>
@import url(@/components/item/EditorCommon.less);

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
