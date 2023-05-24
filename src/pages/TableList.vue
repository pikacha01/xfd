<script setup lang="ts">
import { useFormStore } from "@/store";
import {} from 'vue'

// 获取自定义的store
const formStore = useFormStore()

const selectionChange = () => {
  
}
</script>

<template>
<view class="all">
  <view class="content">
    <uni-table class="table" :stripe="false"  type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
      <uni-tr  class="table" v-for="item in formStore.currentFormSteps?.data.initData['ChildTableField_28']" :key="item">
        <uni-td>组件SN</uni-td>
        <uni-td>
          <view class="name">{{ item }}</view>
        </uni-td>
      </uni-tr>
    </uni-table>
  </view>
</view>
</template>

<style scoped lang="scss">
.all {
  background-color: #f6f7f9;
}
.content {
  margin: 0 32rpx 190rpx;
}
.table {
  width: 100%;
}
</style>
