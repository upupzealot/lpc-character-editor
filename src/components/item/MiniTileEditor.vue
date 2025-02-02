<template>
  <div class="step">
    <a-button :type="tileImageUrl ? 'primary' : 'default'" shape="circle"
      >1</a-button
    ><span class="title">{{ tileImageBtnText }}</span>
    <div class="content">
      <TileSelecter
        ref="tileImageSelecter"
        v-model="tileImageUrl"
      ></TileSelecter>
      <a-button @click="$refs.tileImageSelecter!.openSelecter()">
        upload
      </a-button>
    </div>
  </div>

  <a-divider></a-divider>

  <div class="step">
    <a-button :type="tileDataImageUrl ? 'primary' : 'default'" shape="circle"
      >2</a-button
    ><span class="title">{{ tileDataImageBtnText }}</span>
    <div class="content">
      <TileSelecter
        ref="tileDataImageSelecter"
        v-model="tileDataImageUrl"
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
  </div>
  <a-button :disabled="!tileImageUrl || !tileDataImageUrl">generate</a-button>
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
