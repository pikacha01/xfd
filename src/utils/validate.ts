import { userApi } from "@/api";

// 验证邮箱
export const emailValidator = async (rule: any, value: string) => {
  const test = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if (value === null || value === "") {
    return Promise.resolve(new Error('输入正确的邮箱'));
  } else if (!test.test(value)) {
    return Promise.reject(new Error('输入正确的邮箱'));
  }
  return Promise.resolve();
};

// 验证手机
export const smartPhoneValidator = async (rule: any, value: string) => {
  const test = /^1[3456789]\d{9}$/;
  if (value === null || value === "") {
    return Promise.resolve();
  } else if (!test.test(value)) {
    return Promise.reject(new Error("输入正确的手机号码"));
  }
  return Promise.resolve();
};

// 逻辑控件
export const logicValidator = async (rule: any, value: any) => {
  if (value === false) {
    return Promise.reject(new Error("请输入正确的值"));
  }
  return Promise.resolve();
};

// 验证固定电话
export const homePhoneValidator = async (rule: any, value: string) => {
  const test = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  if (value === null || value === "") {
    return Promise.resolve();
  } else if (!test.test(value)) {
    return Promise.reject(new Error("输入正确的固定电话"));
  }
  return Promise.resolve();
};

//验证金额的输入格式
export const amountValidator = async (
  rule: any,
  value: string | number
) => {
  const test = /^-?[0-9.]*$/;
  if (value === null || value === "") {
    return Promise.resolve();
  } else if (!test.test(value as string)) {
    return Promise.reject(new Error("金额应当为数值"));
  }
  return Promise.resolve();
};

// 身份证
export const identityValidator = async (_: any, value: string) => {


  const v = (ident: string) => {
    // 加权因子
    const weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    const check_code = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    const code = ident + "";
    const last = ident[17]; //最后一位
    const seventeen = code.substring(0, 17);
    const arr = seventeen.split("");
    const len = arr.length;
    let num = 0;
    for (let i = 0; i < len; i++) {
      num = num + Number(arr[i]) * weight_factor[i];
    }
    const res = num % 11;
    const last_no = check_code[res];
    const reg = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
    const format = reg.test(ident);
    return last === last_no && format ? true : false;
  };

  if (value === null || value === "") {
    return Promise.resolve();
  } else if (!v(value)) {
    return Promise.reject(new Error("请输入正确的身份证"));
  }
  return Promise.resolve();
};

// 港澳
export const hongkongValidator = async (_: any, value: string) => {
  const reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/;
  if (value === null || value === "") {
    return Promise.resolve();
  } else if (!reg.test(value)) {
    return Promise.reject(new Error("请输入正确的港澳通行证"));
  }
  return Promise.resolve();
};

// 台湾
export const wanWanValidator = async (_: any, value: string) => {
  const reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;
  if (value === null || value === "") {
    return Promise.resolve();
  } else if (!reg.test(value)) {
    return Promise.reject(new Error("请输入正确的台湾通行证"));
  }
  return Promise.resolve();
};

// 护照
export const passportValidator = async (_: any, value: string) => {
  const reg = /^E\d{8}$/;
  if (value === null || value === "") {
    return Promise.resolve();
  } else if (!reg.test(value)) {
    return Promise.reject(new Error("请输入正确的护照"));
  }
  return Promise.resolve();
};
//校验唯一值
export const ValidtorUniqueData = async (unique: boolean, companyId: string, formId: string, field: string, mess: Record<string, any>) => {
  //校验唯一值
  if (unique) {
    const res = await userApi.getUniqueData(
      companyId,
      formId,
      field,
      mess
    )
    if (!res.success) {
      return Promise.reject(new Error(res.info))
    }
  }
}
