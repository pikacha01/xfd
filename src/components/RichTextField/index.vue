<template>
  <view class="uni-form-item">
    <uni-forms-item
      :name="props.item.id"
      :rules="[
        {
          required: props.item.required,
          errorMessage: `${props.item.label}不能为空`,
        },
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <view
        :class="[
          'custom-input',
          'lineHeight',
          'rich',
          props.item.readonly ? 'disable' : '',
        ]"
        @click="editor"
      >
        <rich-text :nodes="html" v-if="html" @itemclick="editor"></rich-text>
        <view v-else>{{ props.item.placeholder }}</view>
      </view>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { useCountStore } from "@/store";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
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
// 获取自定义的store
const store = useCountStore();

// 取需要的 state
const { html } = storeToRefs(store);

watch(
  () => props.value[props.item.id],
  value => {
    if (!value) {
      //@ts-ignore
      // editRef.value.clearContent();
      store.$patch(store => {
        store.html = "";
      });
    }
  }
);
function editor() {
  uni.navigateTo({
    url: `/pages/editRichText/index?placeholder=${props.item.placeholder}`,
  });
}

onShow(() => {
  props.value[props.item.id] = html.value;
  
});
</script>

<style lang="scss">
.container {
  position: fixed;
  top: 0;
  background: #fff;
  z-index: 99;
  width: 100%;
  max-width: 800px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.rich {
  max-height: 300px;
  overflow: hidden;
  word-break: break-all;
}
</style>
