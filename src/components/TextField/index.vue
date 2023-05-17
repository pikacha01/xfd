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
        v-model="props.value[props.item.id]"
        :clearable="false"
        @change.once="change"
        :type="props.item.multiRow ? 'textarea' : 'text'"
        :placeholder="props.item?.placeholder"
        :disabled="props.item.readonly"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { userApi } from "@/api";
import { useCountStore } from "@/store";
import { storeToRefs } from "pinia";
import { onMounted, watch, WatchStopHandle } from "vue";
import { ValidtorUniqueData } from "@/utils/validate";

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
let watchFn: WatchStopHandle;
onMounted(() => {
  if (props.item.defaultValue) {
    let defaultValue = "";
    props.item.defaultValue.map(item => {
      if (!item.widgetId) {
        defaultValue += item.label;
      }
    });
    props.value[props.item.id] = defaultValue;

    watchFn = watch(
      () => [
        ...props.item.defaultValue.map(item => {
          if (item.widgetId) {
            return props.value[item.widgetId];
          }
        }),
      ],
      newV => {
        const strs = newV.filter(value => value);
        props.value[props.item.id] =
          defaultValue + strs.toString().replaceAll(",", "");
      }
    );
  }
});

// 获取自定义的store
const store = useCountStore();

// 取需要的 state
const { companyId, formId } = storeToRefs(store);

// 输入后取消监听
function change() {
  watchFn?.();
}
</script>

<style></style>
