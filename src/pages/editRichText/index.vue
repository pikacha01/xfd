<template>
  <view class="container">
    <jin-edit
      height="200"
      :placeholder="props.placeholder"
      @editOk="editOk"
      uploadFileUrl="/#"
      ref="editRef"
      :html="html"
    ></jin-edit>
  </view>
</template>

<script lang="ts" setup>
import jinEdit from "@/common/jin-edit/jin-edit.vue";
import { useCountStore } from "@/store";
import { onBackPress, onLoad, onShow } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { ref } from "vue";
// 获取自定义的store
const store = useCountStore();

const props = defineProps({
  placeholder: {
    type: String,
    default: () => "",
  },
});

const editRef = ref(null);
const { html, companyId, formId } = storeToRefs(store);

const editOk = e => {
  
  store.$patch(store => {
    store.html = e;
  });
  uni.navigateBack();
};

// onBackPress(() => {
// });

onShow(() => {
  console.log("onShow");
});

onLoad(() => {
  uni.setNavigationBarTitle({ title: "编辑富文本" });

  //   showHtml.value = html.value;
  //   
  console.log("onLoad");
});
</script>

<style></style>
