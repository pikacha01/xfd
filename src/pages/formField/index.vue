<template>
  <view>
    <!-- RefField -->
    <template v-if="props.refItem.tag == 'RefField' && fieldItem.id">
      <template v-if="formatStr(props.refItem.refFieldId) == 'TextField'">
        <TextField :item="fieldItem" :value="props.value"></TextField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'AmountField'"
      >
        <AmountField :item="fieldItem" :value="props.value"></AmountField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'GroupField'">
        <GroupField :item="fieldItem" :value="props.value"></GroupField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'DateField'">
        <DateField :item="fieldItem" :value="props.value"></DateField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'EmailField'">
        <EmailField :item="fieldItem" :value="props.value"></EmailField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'NumberField'"
      >
        <NumberField :item="fieldItem" :value="props.value"></NumberField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'PhoneField'">
        <PhoneField :item="fieldItem" :value="props.value"></PhoneField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'SelectField'"
      >
        <SelectField :item="fieldItem" :value="props.value"></SelectField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'PicField'">
        <PicField :item="fieldItem" :value="props.value"></PicField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'AutoNumberField'"
      >
        <AutoNumberField
          :item="fieldItem"
          :value="props.value"
        ></AutoNumberField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'FileField'">
        <FileField :item="fieldItem" :value="props.value"></FileField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'GradeField'">
        <GradeField :item="fieldItem" :value="props.value"></GradeField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'IdentityField'"
      >
        <IdentityField :item="fieldItem" :value="props.value"></IdentityField>
      </template>
      <template
        v-else-if="
          formatStr(props.refItem.refFieldId) == 'TextCombinationField'
        "
      >
        <TextCombinationField
          :item="fieldItem"
          :value="props.value"
        ></TextCombinationField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'PositionField'"
      >
        <PositionField :item="fieldItem" :value="props.value"></PositionField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'RegionField'"
      >
        <RegionField :item="fieldItem" :value="props.value"></RegionField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'FormulaField'"
      >
        <FormulaField :item="fieldItem" :value="props.value"></FormulaField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'RichTextField'"
      >
        <RichTextField :item="fieldItem" :value="props.value"></RichTextField>
      </template>
      <template
        v-else-if="formatStr(props.refItem.refFieldId) == 'EmbeddedField'"
      >
        <EmbeddedField :item="fieldItem" :value="props.value"></EmbeddedField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'LogicField'">
        <LogicField :item="fieldItem" :value="props.value"></LogicField>
      </template>
      <template v-else-if="formatStr(props.refItem.refFieldId) == 'VideoField'">
        <VideoField :item="fieldItem" :value="props.value"></VideoField>
      </template>
    </template>
    <!-- 非RefField -->
    <template v-else>
      <template v-if="props.refItem.tag == 'ShowPicField'">
        <ShowPicField :item="props.refItem"></ShowPicField>
      </template>
      <template v-else-if="props.refItem.tag == 'ShowRichTextField'">
        <ShowRichTextField :item="props.refItem"></ShowRichTextField>
      </template>
      <template v-else-if="props.refItem.tag == 'ShowFileField'">
        <ShowFileField :item="props.refItem"></ShowFileField>
      </template>
    </template>
  </view>
</template>

<script lang="ts" setup>
import TextField from "@/components/TextField/index.vue";
import AmountField from "@/components/AmountField/index.vue";
import EmailField from "@/components/EmailField/index.vue";
import AutoNumberField from "@/components/AutoNumberField/index.vue";
import DateField from "@/components/DateField/index.vue";
import FileField from "@/components/FileField/index.vue";
import GradeField from "@/components/GradeField/index.vue";
import PicField from "@/components/PicField/index.vue";
import GroupField from "@/components/GroupField/index.vue";
import NumberField from "@/components/NumberField/index.vue";
import PhoneField from "@/components/PhoneField/index.vue";
import SelectField from "@/components/SelectField/index.vue";
import IdentityField from "@/components/IdentityField/index.vue";
import TextCombinationField from "@/components/TextCombinationField/index.vue";
import PositionField from "@/components/PositionField/index.vue";
import RegionField from "@/components/RegionField/index.vue";
import ShowPicField from "@/components/ShowPicField/index.vue";
import ShowRichTextField from "@/components/ShowRichTextField/index.vue";
import ShowFileField from "@/components/ShowFileField/index.vue";
import FormulaField from "@/components/FormulaField/index.vue";
import RichTextField from "@/components/RichTextField/index.vue";
import EmbeddedField from "@/components/EmbeddedField/index.vue";
import LogicField from "@/components/LogicField/index.vue";
import VideoField from "@/components/VideoField/index.vue";

import { storeToRefs } from "pinia";
import { useCountStore } from "@/store";
import { computed, PropType } from "vue";
import { FormFiled } from "@/constants/form";

// 获取自定义的store
const store = useCountStore();
// 取需要的 state
const { FormGrid } = storeToRefs(store);

const fieldItem = computed(() => {
  if (props.refItem.tag == "RefField") {
    return (
      FormGrid.value.find(item => {
        return item.id == props.refItem.refFieldId;
      }) || { id: "" }
    );
  }
  return {};
});

const formatStr = (str: string) => {
  if (!str) return "";
  return str.split("_")[0];
};

const props = defineProps({
  refItem: {
    type: Object as PropType<FormFiled>,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
});
</script>

<style></style>
