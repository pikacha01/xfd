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
            return getType(props.item.type, rule, value);
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
        :type="props.item.type == 1 ? 'idcard' : 'text'"
        maxlength="18"
        :clearable="false"
        v-model="props.value[props.item.id]"
        :placeholder="props.item?.placeholder"
        :disabled="props.item.readonly"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { useCountStore } from "@/store";
import {
  identityValidator,
  hongkongValidator,
  wanWanValidator,
  passportValidator,
  ValidtorUniqueData,
} from "@/utils/validate";
import { storeToRefs } from "pinia";

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

const getType = (type: number, rule: any, value: any) => {
  switch (type) {
    case 1:
      return identityValidator(rule, value);
    case 2:
      return hongkongValidator(rule, value);
    case 3:
      return wanWanValidator(rule, value);
    default:
      return passportValidator(rule, value);
  }
};
</script>

<style></style>
