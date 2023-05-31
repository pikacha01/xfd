<script setup lang="ts">
import { PropType } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { IfFormGrid } from '@/constants/form'
import TextField from '@/components/inputField/index.vue'
import DateField from '@/components/DateInput/index.vue'
import GroupField from '@/components/PickerSelect/index.vue'
import IDField  from '@/components/IDField/index.vue'
import RegionField from '@/components/RegionInput/index.vue'
import IDDateEnd  from '@/components/IDDateEnd/index.vue'
import PositionField  from '@/components/PositionComponent/index.vue'
import JoinFormField  from '@/components/JoinFormField/index.vue'
import PicField  from '@/components/ImgField/index.vue'
import FileField from '@/components/FileInput/index.vue'
import ChildTableField from '@/components/ChildField/index.vue'

const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
  step: {
    type: Number,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  componentList: { 
    type: Object as PropType<IfFormGrid>,
    required: true
  }
});



</script>

<template>
<view>
  <view class="title">
    <view class="left">{{ step }}.{{index + 1 }} {{ data.label }}</view>
    <view class="right">
      <uni-icons type="top" size="22"></uni-icons>
      <!-- <uni-icons type="bottom" size="22"></uni-icons> -->
    </view>
  </view>
  <template v-for="item in componentList">
    <template v-if="item.tag === 'TextField' || item.tag === 'IdentityField' || item.tag === 'NumberField'">
      <TextField :data="item"></TextField>
    </template>
    <template v-else-if ="item.tag === 'PhoneField'">
      <TextField :data="item"></TextField>
    </template>
    <template v-else-if ="item.tag === 'DateField' &&  item.id === 'DateField_17'">
      <IDDateEnd :data="item"></IDDateEnd>
    </template>
    <template v-else-if ="item.tag === 'DateField'">
      <DateField :data="item"></DateField>
    </template>
    <template v-else-if ="item.tag === 'GroupField'">
      <GroupField :data="item"></GroupField>
    </template>
    <template v-else-if ="item.tag === 'PicField' && item.id === 'PicField_43'">
      <IDField :data="item"></IDField>
    </template>
    <template v-else-if ="item.tag === 'RegionField'">
      <RegionField :data="item"></RegionField>
    </template>
    <template v-else-if ="item.tag === 'PositionField'">
      <PositionField :data="item"></PositionField>
    </template>
    <template v-else-if ="item.id === 'JoinFormField_80'">
      <JoinFormField :data="item"></JoinFormField>
    </template>
    <template v-else-if ="item.tag === 'PicField' && item.label !== '身份证国徽面'">
      <PicField :data="item"></PicField>
    </template>
    <template v-else-if ="item.tag === 'FileField'">
      <FileField :data="item"></FileField>
    </template>
    <template v-else-if ="item.tag === 'ChildTableField'">
      <ChildTableField :data="item"></ChildTableField>
    </template>
  </template>
</view>

</template>

<style scoped lang="scss">
.title {
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  color: #221815;
  line-height: 40rpx;
  min-height: 40rpx;
  font-size: 28rpx;
  padding: 30rpx 0;
  font-weight: bold;
}
</style>
