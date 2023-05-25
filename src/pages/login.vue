<template>
  <div class="uni-forms">
    <!-- label-position="top" -->
    <uni-forms validateTrigger="blur" ref="formRef" :model="model">
      <uni-forms-item
        name="phone"
        label="手机号"
        :rules="[
          {
            required: true,
            errorMessage: `手机号不能为空`,
          },
          {
            validateFunction: (rule, value) => {
              return smartPhoneValidator(rule, value);
            },
          },
        ]"
      >
        <uni-easyinput
          v-model="model.phone"
          placeholder="手机号"
          maxlength="11"
          trim="all"
          type="number"
        >
        </uni-easyinput>
      </uni-forms-item>
      <uni-forms-item
        name="passWord"
        label="密码"
        :rules="[
          {
            required: true,
            errorMessage: `密码不能为空`,
          },
        ]"
      >
        <uni-easyinput
          placeholder="密码"
          trim="all"
          type="password"
          v-model="model.passWord"
        >
        </uni-easyinput>
      </uni-forms-item>
      <button
        class="submit primary-button"
        hover-class="primary-hover"
        @click="submit"
      >
        登录
      </button>
    </uni-forms>
  </div>
</template>
<script setup lang="ts">
import { userApi } from "@/api";
import { useCountStore, useClientStore } from "@/store";
import { smartPhoneValidator } from "@/utils/validate";
import { onReady } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
const model = reactive({
  phone: "",
  passWord: "",
});
const formRef = ref(null);
// 获取自定义的store
const store = useCountStore();

// 保存菜单选项
const clientStore = useClientStore()
onReady(() => {
  uni.setNavigationBarTitle({
    title: "登录",
  });
});

const submit = () => {
  console.log(formRef.value);

  //@ts-ignore
  formRef.value.validate().then(res => {
    userApi.getRsaPublicKey().then(res => {
      if (res.status == 0) {
        userApi.getToken(res.data, model.phone, model.passWord).then(res => {
          if (res.status == 0) {
            uni.showToast({ title: "登录成功" });
            const { access_token } = res.data.map;
            const token = `Bearer ${access_token}`;
            store.$patch(v => (v.token = token));
            uni.navigateTo({
              url: 'index/index'
            })
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
            model.passWord = "";
          }
        });
      }
    });
  });
};
</script>
<style scoped lang="scss">
.uni-forms {
  margin: 250px auto;
  width: 90%;
  .submit {
    margin-top: 30px;
  }
}
</style>
