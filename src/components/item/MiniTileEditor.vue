<template>
  <TileSelecter
    :btn-text="tileImageBtnText"
    v-model="tileImageUrl"
  ></TileSelecter>
  <TileSelecter
    :btn-text="tileDataImageBtnText"
    v-model="tileDataImageUrl"
  ></TileSelecter>
  <a-button :disabled="!tileImageUrl || !tileDataImageUrl">
    generate {{ state.opPart }} tile
  </a-button>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import TileSelecter from './TileSelecter.vue'

export default {
  components: { TileSelecter },
  data() {
    return {
      tileImageUrl: '',
      tileDataImageUrl: '',
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
}
</script>
