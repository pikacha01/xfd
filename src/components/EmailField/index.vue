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
          validateFunction: (rule, value) => {
            return emailValidator(rule, value);
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
        },
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <uni-easyinput
        type="email"
        :clearable="false"
        v-model="props.value[props.item.id]"
        :placeholder="props.item?.placeholder"
        :disabled="props.item.readonly"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { emailValidator } from "@/utils/validate";
import { onShow } from "@dcloudio/uni-app";
import { useCountStore } from "@/store";
import { ValidtorUniqueData } from "@/utils/validate";
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
onShow(() => {});
</script>

<style></style>
