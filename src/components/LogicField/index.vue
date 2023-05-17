<template>
  <view class="uni-form-item uni-column">
    <uni-forms-item
      :name="props.item.id"
      :rules="[
        {
          required: props.item.required,
          errorMessage: `${props.item.label}不能为空`,
        },
        props.item.required && {
          validateFunction: (rule, value) => {
            return logicValidator(rule, value);
          },
        },
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <div class="flex-ac">
        <switch
          :style="'transform: scale(' + (props.item.type == 0 ? 1 : 0.9) + ')'"
          :disabled="props.item.readonly"
          :type="props.item.type == 0 ? 'checkbox' : 'switch'"
          @change="change"
          :checked="
            props.item.defaultValue
              ? true
              : props.value[props.item.id]
              ? true
              : false
          "
        />
        <div class="ml5">
          {{
            props.item.type == 0
              ? props.item.checkNote
              : props.value[props.item.id]
              ? props.item.switchOpenNote
              : props.item.switchCloseNote
          }}
        </div>
      </div>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";
import { logicValidator } from "@/utils/validate";

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
function change(e) {
  props.value[props.item.id] = e.detail.value;
}
onMounted(() => {
  props.value[props.item.id] = props.item.defaultValue;
});
</script>

<style></style>
