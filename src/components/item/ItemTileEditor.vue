<template>
  <TileSelecter :btn-text="`upload ${state.opPart} tile image`"></TileSelecter>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useItemEditerStore } from '@/stores/itemEditor'
import TileSelecter from './TileSelecter.vue'

export default {
  components: { TileSelecter },
  computed: {
    ...mapState(useItemEditerStore, ['state']),
  },
}
</script>
