<template>
  <view class="uni-form-item">
    <uni-forms-item
      :name="props.item.id"
      :rules="[
        {
          required: props.item.required,
          errorMessage: `${props.item.label}不能为空`,
        },
        {
          validateFunction: () => {
            //校验唯一值
            return ValidtorUniqueData(
              props.item.unique,
              companyId,
              formId,
              props.item.id,
              props.value
            );
          },
        },
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <uni-easyinput
        trim="all"
        :clearable="false"
        v-model="props.value.showValue"
        @change="changeValue"
        @input="inputV"
        :placeholder="props.item?.placeholder"
        :disabled="props.item.readonly"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, watch, WatchStopHandle } from "vue";
import { ValidtorUniqueData } from "@/utils/validate";
import { useCountStore } from "@/store";
import { storeToRefs } from "pinia";
// 获取自定义的store
const store = useCountStore();

// 取需要的 state
const { companyId, formId } = storeToRefs(store);

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

const changeValue = e => {
  // 输入后取消监听
  watchFn?.();
  if (format(e)) {
    props.value.showValue =
      Number(format(e)).toFixed(props.item.scale) + props.item.unit;
  } else {
    props.value.showValue = "";
    props.value[props.item.id] = "";
  }
};
const inputV = e => {
  if (format(e)) {
    props.value[props.item.id] = Number(format(e)).toFixed(props.item.scale);
  }
};
function format(text): string {
  if (!text) {
    return "";
  }
  let numbers = text.match(/([1-9]\d*\.?\d*)|(0\.\d*[1-9])/g);
  return numbers ? numbers[0] : "";
}
let watchFn: WatchStopHandle;
onMounted(() => {
  if (props.item.defaultValue) {
    // 监听默认值
    watchFn = watch(
      () => props.value[props.item.defaultValue.widgetId],
      newV => {
        props.value.showValue = newV;
        props.value[props.item.id] = newV;
      }
    );
  }
});
</script>

<style></style>
