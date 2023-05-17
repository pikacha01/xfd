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
      <checkbox-group @change="onChange" :disabled="props.item.readonly">
        <label v-for="list in props.item.items" :key="list.label" class="mr20">
          <checkbox
            :value="list.value"
            :checked="
              list.checked || props.value[props.item.id]
                ? props.value[props.item.id].includes(list.value)
                : false
            "
            color="#2977ff"
          />
          <text :style="{ color: props.item.color ? list.color : '' }">
            {{ list.label }}
          </text>
        </label>
      </checkbox-group>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

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

const onChange = e => {
  props.value[props.item.id] = e.detail.value;
};

onMounted(() => {
  props.item.items.map(({ value, checked }) => {
    if (checked) {
      props.value[props.item.id] = value;
    }
  });
});
</script>

<style lang="scss">
.mr20 {
  text {
    font-size: 22rpx;
  }
}
uni-checkbox {
  vertical-align: 4px;
}
</style>
