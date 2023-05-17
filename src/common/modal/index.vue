<template>
  <view v-if="props.visiable">
    <view class="popup">
      <view class="dialog">
        <view class="title">{{ props.title }}</view>
        <view class="content">
          <slot name="content" />
        </view>
        <view class="footer">
          <slot name="footer" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  visiable: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss">
.popup {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  left: 0;
  top: 0;
  position: fixed;
  z-index: 9;
  .dialog {
    width: 300px;
    border-radius: 11px;
    background-color: #fff;
    position: absolute;
    padding: 20px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      color: #909399;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }
    .content {
      margin: 20px auto;
    }
  }
}
</style>
