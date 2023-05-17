<template>
  <view class="uni-form-item uni-column">
    <uni-forms-item
      :name="props.item.id"
      :rules="[
        {
          required: props.item.required,
          errorMessage: `${props.item.label}不能为空`,
        },
        {
          validateFunction: (rule, value) => {
            return amountValidator(rule, value);
          },
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
        }
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <uni-easyinput
        trim="all"
        type="digit"
        :clearable="false"
        :disabled="props.item.readonly"
        @change="changeValue"
        v-model="props.value[props.item.id]"
        :placeholder="props.item?.placeholder"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { userApi } from "@/api";
import { useCountStore } from "@/store";
import { amountValidator, ValidtorUniqueData } from "@/utils/validate";
import { storeToRefs } from "pinia";
import { onMounted, watch, WatchStopHandle } from "vue";

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
const { companyId, formId } = storeToRefs(store);

const changeValue = e => {
  // 输入后取消监听
  watchFn?.();
  if (!e) {
    return;
  }
  const num = e.match(/([1-9]\d*\.?\d*)|(0\.\d*[1-9])/g);
  if (num) {
    props.value[props.item.id] = Number(num[0]).toFixed(props.item.scale);
  }
};
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
