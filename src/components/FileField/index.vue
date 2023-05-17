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
      <uni-file-picker
        :file-mediatype="fileType"
        disable-preview
        mode="list"
        v-model="model.values"
        :limit="props.item.multiple ? 99 : 1"
        ref="fileUploadRef"
        :file-extname="accept"
        @select="select"
        :auto-upload="false"
        @delete="deleteFile"
        :readonly="props.item.readonly"
      >
        <button class="primary-button" size="mini" hove-class="primary-hover">
          选择文件
        </button>
      </uni-file-picker>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import user from "@/api/modules/user";
import { fileCate, IfObsKey } from "@/constants/form";
import { computed, onMounted, reactive, ref, watch } from "vue";
import OBSupload from "@/utils/obs/upload";

interface Model {
  values: Array<any>;
}
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

function deleteFile(e) {
  const {
    tempFile: { name },
  } = e;

  const index = model.values.findIndex(({ fileName }) => fileName == name);
  if (index > -1) {
    model.values.splice(index, 1);
  }
}

const model: Model = reactive({
  values: [],
});

const acceptFile = new Map([
  [1, fileCate.pic],
  [2, fileCate.video],
  [
    3,
    [
      ...fileCate.word,
      ...fileCate.excel,
      ...fileCate.pdf,
      ...fileCate.ppt,
      "txt",
    ],
  ],
]);

const accept = computed(() => {
  if (props.item.acceptType.includes(0)) return;
  return props.item.acceptType.reduce(
    (prev, item) => (prev += `${acceptFile.get(item)?.join(",")}`),
    ""
  );
});

const fileType = computed(() => {
  if (props.item.acceptType == 1) {
    return "image";
  } else if (props.item.acceptType == 2) {
    return "video";
  } else {
    return "all";
  }
});
console.log(accept.value);

const fileUploadRef = ref(null);

// 选择文件
const select = e => {
  const temp: Array<any> = [];
  uni.showLoading({ title: "正在上传中..." });
  user.getObsKey().then((res: IfObsKey) => {
    e.tempFiles.map(async file => {
      const fileObj = await OBSupload(file.file, res, fileUploadRef);
      temp.push(fileObj);
      props.value[props.item.id].push(fileObj);
      if (e.tempFiles.length == temp.length) {
        uni.hideLoading();
      }
    });
  });
};
watch(
  () => props.value[props.item.id],
  newV => {
    if (!newV) {
      model.values = [];
      props.value[props.item.id] = [];
    }
  }
);
onMounted(() => {
  props.value[props.item.id] = [];
});
</script>

<style></style>
