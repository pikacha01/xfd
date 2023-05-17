<template>
  <view class="uni-form-item">
    <uni-forms-item>
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>

      <uni-easyinput
        disabled
        v-model="props.value[props.item.id]"
        :placeholder="props.item?.placeholder"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { watch } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
});
// 监听默认值
watch(
  () => [
    ...props.item.textCombinationSetting.map(item => {
      if (item.value) {
        return props.value[item.value[0].value];
      }
    }),
  ],
  newV => {
    setTimeout(() => {
      const strs = newV.filter(value => value);
      props.value[props.item.id] = strs.toString();
      
    }, 1000);
  }
);
</script>

<style></style>
