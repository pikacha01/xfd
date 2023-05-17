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
            if (props.item.type == 0) {
              return smartPhoneValidator(rule, value);
            } else {
              return homePhoneValidator(rule, value);
            }
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
        trim="all"
        maxlength="11"
        type="number"
        :clearable="false"
        v-model="props.value[props.item.id]"
        :placeholder="props.item?.placeholder"
        :disabled="props.item.readonly"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import {
  smartPhoneValidator,
  homePhoneValidator,
  ValidtorUniqueData,
} from "@/utils/validate";
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
</script>

<style></style>
