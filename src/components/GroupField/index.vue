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

      <radio-group
        @change="radioChange"
        v-if="props.item.type == 0"
        :disabled="props.item.readonly"
      >
        <label v-for="list in props.item.items" :key="list.label" class="mr20">
          <radio
            :value="list.value"
            :checked="list.checked || props.value[props.item.id] == list.value"
            color="#2977ff"
          />
          <text :style="{ color: props.item.color ? list.color : '' }">
            {{ list.label }}
          </text>
        </label>
      </radio-group>

      <uni-data-select
        v-else
        v-model="props.value[props.item.id]"
        :localdata="model.range"
        :disabled="props.item.readonly"
      ></uni-data-select>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

interface Model {
  range: Array<{ text: string; value: string }>;
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

const radioChange = e => {
  props.value[props.item.id] = e.detail.value;
};

const model: Model = reactive({
  range: [],
});

onMounted(() => {
  model.range = props.item.items.map(({ label, value, checked }) => {
    if (checked) {
      props.value[props.item.id] = value;
    }
    return { text: label, value };
  });
});
</script>

<style lang="scss">
.mr20 {
  text {
    font-size: 22rpx;
  }
}
uni-radio {
  vertical-align: 4px;
}
</style>
