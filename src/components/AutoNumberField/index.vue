<template>
  <view class="uni-form-item">
    <uni-forms-item>
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <uni-easyinput disabled :value="props.item.label" />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
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
</script>