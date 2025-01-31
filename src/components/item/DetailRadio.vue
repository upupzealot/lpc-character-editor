<template>
  <div class="item-list">
    <div
      v-for="(option, i) in options"
      :key="option.value"
      :class="option.value === modelValue ? ['item', 'selected'] : 'item'"
      @click="handleChange(option.value)"
    >
      <a-radio v-model:checked="checks[i]" style="margin-top: 2px"></a-radio>
      <div class="content">
        <div class="title">{{ option.label }}</div>
        <div class="desc">{{ option.desc }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.item-list {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.item {
  position: relative;
  border: rgb(217, 217, 217) 1px solid;
  border-radius: 4px;
  padding: 5px 10px;
  flex: 1;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  cursor: pointer;
}
.item:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.item:not(:first-child) {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.item.selected {
  background-color: #e6f4ff;
}
.item .icon {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 10px;

  border: rgba(5, 5, 5, 0.06) 1px solid;
  border-radius: 50%;
}
.item.selected .icon {
  background-color: #fff;
  border-color: #1677ff;
}
.content {
  // margin-left: 26px;
}
.title {
  font-size: 24px;
  line-height: 25px;
  font-weight: 600;
  margin-bottom: 10px;
}
.desc {
  color: rgba(0, 0, 0, 0.45);
}
</style>

<script lang="ts">
export type DetailRadioOption = {
  value: string
  label: string
  desc: string
}

export default {
  name: 'DetailRadio',
  props: {
    options: {
      type: Array<DetailRadioOption>,
      required: true,
      validator: (value: Array<DetailRadioOption>) =>
        value.every((option) => 'value' in option && 'label' in option),
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    checks() {
      return this.options.map((option) => {
        return option.value === this.modelValue
      })
    },
  },
  methods: {
    handleChange(value: string) {
      this.$emit('update:modelValue', value)
    },
  },
}
</script>
