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
      <uni-rate
        v-model="props.value[props.item.id]"
        :readonly="props.item.readonly"
        :max="props.item?.options?.length"
        :size="24"
        :value="props.item.defaultValue"
      />
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useCountStore } from "@/store";
import { ValidtorUniqueData } from "@/utils/validate";
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

onMounted(() => {
  props.value[props.item.id] = props.item.defaultValue;
});
</script>

<style></style>
