<template>
  <Home v-if="showSelected?.pagePath == 'pages/home'"></Home>
  <Me v-else-if="showSelected?.pagePath == 'pages/me'"></Me>
  <Add v-else></Add>
  <view class="nav-bar">
    <template v-for="(item, index) in model.tabList">
      <view v-if="index == 1" @click="selected(index)">
        <view class="rise-wrap">
          <image :src="item.iconPath" class="rise"></image>
        </view>
      </view>
      <view v-else @click="selected(index)">
        <image :src="item.selectedIconPath" v-if="item.selected"></image>
        <image :src="item.iconPath" v-else></image>
        <view v-if="index != 1" :class="{ selected: item.selected }">
          {{ item.text }}
        </view>
      </view>
    </template>
  </view>

  <view class="content-index">
    <!-- <template v-for="item in model.menu" :key="item.id">
      <view> {{ item.name }}</view>
    </template> -->

    <!-- <Modal title="输入密码" :visiable="model.showModal">
      <template #content>
        <uni-easyinput placeholder="请输入密码" v-model="model.password" />
        <span
          v-if="model.prompt"
          style="position: relative; color: #909399; top: 10px"
          >密码提示：{{ model.prompt }}</span
        >
      </template>
      <template #footer>
        <button class="primary-button" hover-class="primary-hover">确定</button>
      </template>
    </Modal> -->
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Menu } from "@/constants/form";
import { userApi } from "@/api";
import { storeToRefs } from "pinia";
import { useCountStore,useFormStore } from "@/store";
import Home from "@/pages/home.vue";
import Me from "@/pages/me.vue";
import Add from "@/pages/add.vue";
import {onShareAppMessage } from '@dcloudio/uni-app'

type tabItem = {
  selected: boolean;
  iconPath: string;
  pagePath: string;
  text: string;
  selectedIconPath: string;
};
interface Model {
  menu: Menu[];
  tabList: Array<tabItem>;
}

onShareAppMessage(() => {
  return {
      title: '华福宝小程序',
      path: '/pages/login',
    }
})

const model: Model = reactive({
  menu: [],
  tabList: [
    {
      pagePath: "pages/home",
      iconPath: "../../static/tabBar/home.png",
      selectedIconPath: "../../static/tabBar/homeSelected.png",
      text: "首页",
      selected: true,
    },
    {
      pagePath: "pages/add",
      iconPath: "../../static/tabBar/add.png",
      selectedIconPath: "../../static/tabBar/add.png",
      text: "增加",
      selected: false,
    },
    {
      pagePath: "pages/me",
      iconPath: "../../static/tabBar/me.png",
      selectedIconPath: "../../static/tabBar/meSelected.png",
      text: "我的",
      selected: false,
    },
  ],
});

const formRef = ref(null);

const selected = async index => {
  if (index === 1) {
    await formStore.getNewClient()
    if(formStore.newFormSteps?.stepId === "_end_id") return
    uni.navigateTo({
      url: "/pages/addClient"
    })
    return
  }
  model.tabList.map(item => (item.selected = false));
  model.tabList[index].selected = true;
};

const showSelected = computed(() => {
  return model.tabList.find(({ selected }) => selected);
});

// 获取自定义的store
const store = useCountStore();
const formStore = useFormStore()

// 取需要的 state
const { token } = storeToRefs(store);

// onShow(() => {
//   // uni.showLoading({
//   //   title: "加载中...",
//   // });
//   if (token.value) {
//     // initForm();
//   } else {
//     uni.navigateTo({ url: "/pages/login" });
//   }
//   const pages = getCurrentPages();
//  
// });

// 初始化表单
async function initForm() {
  // @ts-ignore
  model.menu = await userApi.getMenus(
    "790241614973665283",
    "790536127005163522"
  );

  // res.map(menu => ({ name: menu.name, id: menu.id }));
}

/**
 * 提交表单
 */
const submit = () => {
  //@ts-ignore
  formRef.value
    .validate()
    .then(res => {
      // 成功返回，res为表单数据.
      // 其他逻辑处理
      uni.showLoading({ title: "提交中..." });
    })
    .catch(err => {
      // 表单校验验失败，err 为具体错误信息 test

      uni.showToast({
        title: err[0].errorMessage,
        icon: "none",
      });
    });
};

/**
 *
 *  isEven
  const isEven = computed(() => store.count % 2 === 0)
  or 从 getters 中获取
  const { isEven } = storeToRefs(store)
  or 从 getters 中获取
  const isEven = computed(() => store.isEven)
  add 方法
  const add = () =>
    store.$patch((v) => {
      v.form += 1
    })
  or actions
  const add = () => store.synIncrease()
  asyncAdd 方法
  const asyncAdd = () => store.$patch((v) => {
    setTimeout(() => {
      v.count++
    }, 1000)
  })
  or actions
  const asyncAdd = () => store.asyncIncrease();
 *
 */
</script>

<style lang="scss" scoped>
.nav-bar {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 0 40px;
  font-size: 24rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.04);
  width: 100%;
  height: calc(env(safe-area-inset-bottom) + 80px);
  color: black;
  view {
    position: relative;
    padding: 0 10px;
    .rise-wrap {
      padding: 10px;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      position: absolute;
      top: calc(-90rpx - env(safe-area-inset-bottom));
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.04);
      background-color: #fff;

      image.rise {
        width: 100%;
        height: 100%;
      }
    }
    .selected {
      color: #c7000b;
    }

    image {
      width: 35rpx;
      height: 35rpx;
      overflow: hidden;
    }
  }
}
.content-index {
  width: 94%;
  margin: 10rpx auto 0;
  padding-bottom: 80rpx;
}
.submit {
  height: 40px;
  line-height: 40px;
  margin: 40rpx auto 0;
}
.text {
  font-size: 14px;
  margin-top: 20px;
  color: #606266;
}
</style>
