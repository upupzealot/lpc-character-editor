<template>
  <a-form
    ref="form"
    :model="layer.data"
    :label-col="{ style: { width: '80px' } }"
    size="small"
  >
    <a-form-item
      label="name"
      name="name"
      :rules="[{ required: true, message: 'Please input item name!' }]"
    >
      <a-input v-model:value="layer.data.name" />
    </a-form-item>
    <a-form-item
      label="key"
      name="key"
      :rules="[{ required: true, message: 'Please input unique item key!' }]"
    >
      <a-input v-model:value="layer.data.key" />
    </a-form-item>
    <a-form-item label="image" name="image">
      <a-input
        :value="layer.data.key ? `${layer.data.key}.png` : ''"
        disabled
      />
    </a-form-item>
    <a-form-item label="size" name="size">
      <a-input :value="layer.data.size || 32" disabled />
    </a-form-item>
    <a-form-item
      v-for="pIndex in 4"
      :key="pIndex"
      :label="`palette${pIndex}`"
      :name="`palette${pIndex}`"
      :rules="
        pIndex - 1
          ? []
          : [{ required: true, message: 'Please select used palettes!' }]
      "
    >
      <a-select
        v-model:value="
          layer.data[
            `palette${pIndex}` as
              | 'palette1'
              | 'palette2'
              | 'palette3'
              | 'palette4'
          ]
        "
        :allowClear="true"
      >
        <a-select-option
          v-for="(palette, i) in palettes"
          :key="palette.key"
          :value="palette.key"
        >
          <div
            style="
              display: flex;
              flex-direction: row;
              gap: 5px;
              align-items: center;
            "
          >
            <div
              :style="{
                display: 'inline-block',
                width: `${ICON_SIZE}px`,
                height: `${ICON_SIZE}px`,
                backgroundImage: `url(${canvasUrl})`,
                backgroundPosition: `${-i * ICON_SIZE}px`,
                imageRendering: 'pixelated',
              }"
            ></div>
            <div>{{ palette.name }}</div>
          </div>
        </a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import type { Form } from 'ant-design-vue'
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import { getIconCanvas, ICON_SIZE, paletteList } from '@/stores/paletteData'

export default {
  data() {
    return {
      palettes: paletteList,
      ICON_SIZE,
      canvasUrl: '',
    }
  },
  async created() {
    const canvas = await getIconCanvas(this.palettes)
    this.canvasUrl = canvas.toDataURL()
  },
  computed: {
    ...mapState(useItemEditerStore, ['layer']),
  },
  methods: {
    async validate() {
      let error = null
      try {
        await (this.$refs.form as typeof Form).validate()
      } catch (e) {
        error = e
      }
      return error
    },
  },
}
</script>
