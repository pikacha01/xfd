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

      <view
        :class="['custom-input', props.item.readonly ? 'disable' : '']"
        @click="show"
      >
        {{
          props.value.showDate ? props.value.showDate : props.item?.placeholder
        }}
      </view>
    </uni-forms-item>
    <tui-datetime
      :type="getType(props.item.type)"
      ref="dateTime"
      height="600"
      @confirm="change"
    >
    </tui-datetime>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import tuiDatetime from "@/common/tui-datetime/tui-datetime.vue";
import { ValidtorUniqueData } from "@/utils/validate";
import { formatter } from "@/utils/date";
import { useCountStore } from "@/store";
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

const dateTime = ref(null);

// 获取自定义的store
const store = useCountStore();

// 取需要的 state
const { companyId, formId } = storeToRefs(store);

//type: 0 日期,1 日期加时间 2 年 3 年月 4 时间
const getType = (type): number => {
  switch (type) {
    case 0:
      return 2;
    case 1:
      return 1;
    case 2:
      return 3;
    case 3:
      return 3;
    default:
      return 4;
  }
};

function show() {
  if (props.item.readonly) {
    return;
  }
  // @ts-ignore
  dateTime.value.show();
}

const change = e => {
  props.value.showDate = e.result;
  props.value[props.item.id] = e.result;
};
onMounted(() => {
  props.value.showDate = initDefaultValue();
  props.value[props.item.id] = initDefaultValue();
});

function formatDate(nowDate) {
  if (props.item.type) {
    return formatter(nowDate, "yyyy-MM-dd hh:mm:ss");
  }
  return formatter(nowDate, "yyyy-MM-dd");
}

function initDefaultValue(): string | Date {
  const nowDate = new Date();
  if (props.item.defaultValue == 1) {
    return formatDate(nowDate);
  }
  if (props.item.defaultValue == 2) {
    nowDate.setDate(nowDate.getDate() + 1);
    return formatDate(nowDate);
  }
  return props.item.defaultValue;
}
</script>

<style></style>
