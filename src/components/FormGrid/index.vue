<script setup lang="ts">
import { PropType,ref,onMounted,watch } from 'vue'
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
import NumberField from '@/components/NumField/index.vue'
import { useFormStore } from "@/store"

const formStore = useFormStore()

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
  },
});

// 进入校验
onMounted(() => { 
  checkForm()
})

// 拉伸和收缩
const isShow = ref<boolean>(true)

// 展示更多
const showMore = () => {
  isShow.value  = !isShow.value
}

//校验规则
const idFormRules = {
  // 手机号码 
  PhoneField_9: {
    rules: [{
      format: 'string',
      required: true,
      errorMessage: '请输入手机号码',
      validateTrigger: "blur"
    }, {
      validateFunction: function (rule, value, data, callback) {
        return new Promise((resolve, reject) => {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            reject(new Error('手机号码输入错误'))
          }
          //@ts-ignore
          resolve()
        })
      }
    }]
  },
  // 身份证号码验证
  IdentityField_15: {
    rules: [{
      format: 'string',
      validateTrigger: "blur"
    }, {
      validateFunction: function(rule, value, data, callback) {
        return new Promise((resolve, reject) => {
          if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
            reject(new Error('身份证号码输入错误'))
          }
          //@ts-ignore
          resolve()
        })
      }
    }]
  },
  // 地区选择
  RegionField_20: {
    rules: [{
      required: true,
      errorMessage: '地区不能为空'
    }]
  }
}

// 防抖
const debounce = (fn: Function) => {
  let time;
  return () => {
    clearTimeout(time);
    time = setTimeout(() => {
      fn()
    }, 500);
  };
};

// 映射需要校验的字段
let checkList : string[] = []
for (const key in props.componentList) {
  if (props.componentList[key].required) {
    checkList.push(props.componentList[key].id)
  }
}

const isComplete = ref<boolean>(false)

isComplete.value = checkList.length === 0 ? true : false

const formRef = ref(null);

// 校验值
function checkValue(value) {
  if (Array.isArray(value) && value.length > 0) {
    return true;
  } else if (typeof value === 'string' && value.length > 0) {
    return true;
  } else if (typeof value === 'number' && value > 0) {
    return true;
  } else {
    return false;
  }
}

// 校验表单
const checkForm = () => {
  setTimeout(debounce(() => {
    if (checkList.length === 0) {
      formStore.allFormCheck[props.data.id] = true
      return 
    }
    const checkField = checkList.map(item => {
      if(item === "PicField_43" || item === "PicField_44") return true
      if (checkValue(formStore.currentFormSteps?.data.initData[item])) {
        return true
      } else {
        return false
      }
    })
    if (checkField.every(item => item === true) || isComplete.value === true) {
      //@ts-ignore
      formRef.value.validate().then(res=>{
        isComplete.value = true
        formStore.allFormCheck[props.data.id] = true
			}).catch(err =>{
        isComplete.value = false
        formStore.allFormCheck[props.data.id] = false
			})
    }
  }), 100);
};

</script>

<template>
<view>
  <view class="title"  @click="showMore">
    <view class="left">{{ step }}.{{index + 1 }} {{ data.label }}</view>
    <view class="right">
      <view class="complete" v-if="isComplete">
        <uni-icons type="checkmarkempty" size="15" color="#ffffff"></uni-icons>
      </view>
      <uni-icons type="top" size="22" v-if="isShow"></uni-icons>
      <uni-icons type="bottom" size="22" v-else></uni-icons>
    </view>
  </view>
  <view>
    <uni-forms ref="formRef" :border="true" :rules="idFormRules"  :modelValue="formStore.currentFormSteps?.data.initData" label-width="200rpx">
      <view class="showInfo"  v-for="item in componentList" :class="[isShow ? '' : 'hiddenInfo']" :key="item.id">
        <template v-if="item.tag === 'TextField' || item.tag === 'IdentityField'">
          <TextField @check-form="checkForm" :data="item"></TextField>
        </template>
        <template v-else-if ="item.tag === 'PhoneField'  || item.tag === 'NumberField'">
          <NumberField @check-form="checkForm" :data="item"></NumberField>
        </template>
        <template v-else-if ="item.tag === 'DateField' &&  item.id === 'DateField_17'">
          <IDDateEnd :data="item"></IDDateEnd>
        </template>
        <template v-else-if ="item.tag === 'DateField'">
          <DateField @check-form="checkForm" :data="item"></DateField>
        </template>
        <template v-else-if ="item.tag === 'GroupField'">
          <GroupField @check-form="checkForm" :data="item"></GroupField>
        </template>
        <template v-else-if ="item.tag === 'PicField' && item.id === 'PicField_43'">
          <IDField :data="item"></IDField>
        </template>
        <template v-else-if ="item.tag === 'RegionField'">
          <RegionField @check-form="checkForm" :data="item"></RegionField>
        </template>
        <template v-else-if ="item.tag === 'PositionField'">
          <PositionField @check-form="checkForm" :data="item"></PositionField>
        </template>
        <template v-else-if ="item.id === 'JoinFormField_80'">
          <JoinFormField @check-form="checkForm" :data="item"></JoinFormField>
        </template>
        <template v-else-if ="item.tag === 'PicField' && item.label !== '身份证国徽面'">
          <PicField @check-form="checkForm" :data="item"></PicField>
        </template>
        <template v-else-if ="item.tag === 'FileField'">
          <FileField @check-form="checkForm" :data="item"></FileField>
        </template>
        <template v-else-if ="item.tag === 'ChildTableField'">
          <ChildTableField :data="item"></ChildTableField>
        </template>
      </view>
		</uni-forms>  
  </view>
  
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
.showInfo {
  width:100%;
}
.hiddenInfo {
  overflow: hidden;
  height: 0;
}
.complete {
  width: 38rpx;
  height: 38rpx;
  background-color: #c7000b;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 26rpx;
  border-radius:50%;
}
.right {
  display: flex;
  align-items: center;
}
</style>  
