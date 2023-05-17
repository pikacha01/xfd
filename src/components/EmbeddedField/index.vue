<template>
  <view class="uni-form-item uni-column">
    <uni-forms-item>
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>

      <!-- #ifndef H5 -->
      <div class="custom-input disable"></div>
      <!-- #endif -->
      <!-- #ifdef  H5 -->
      <web-view
        :style="{
          width: '100%',
          height: props.item.height + 'px',
        }"
        class="webView"
        :fullscreen="false"
        :src="getUrl()"
      />
      <!-- #endif -->
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
function getUrl() {
  const { value } = props.item.url.find(({ type }) => type == 3);
  return value;
}
</script>
