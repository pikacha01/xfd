<template>
  <view class="uni-form-item">
    <uni-forms-item>
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <view>
        <uni-easyinput
          disabled
          v-model="props.value[props.item.id]"
          :placeholder="props.item?.placeholder"
        />
      </view>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { DATEUNIT, METHOD, NUM } from "@/constants/form";
import { formatter } from "@/utils/date";
import { onMounted, reactive, watch } from "vue";
import { format, number, divide, MathType } from "mathjs";
import FormulaResult from "@/utils/formula_result";

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

interface Model {
  value: any;
}
const model: Model = reactive({
  value: null,
});

// 保留小数
function formatNumber(num: number | string, decimal: number) {
  const middleNum = num.toString();
  let res;
  const index = middleNum.indexOf(".");
  if (index !== -1) {
    res = middleNum.substring(0, decimal + index + 1);
    return parseFloat(res);
  }
  res = middleNum.substring(0);
  return parseFloat(res);
}

// 为日期加减时间输出格式
const selfDateModeMap = new Map([
  // 日期加时间
  [
    NUM.SINGLE,
    { getRes: (second: number) => formatter(second, "yyyy-MM-dd hh:mm:ss") },
  ],
  // 日期
  [NUM.ODD, { getRes: (second: number) => formatter(second, "yyyy-MM-dd") }],
]);

// 格式化年月日时分数值
const dateModeMap = new Map([
  [
    DATEUNIT.YEAR,
    {
      res: (second: number): number =>
        Math.floor(number(format(second / 1000 / 31104000, 14)) as number),
      unit: "年",
    },
  ],
  [
    DATEUNIT.MONTH,
    {
      res: (second: number) =>
        Math.floor(number(format(second / 1000 / 2592000, 14)) as number),
      unit: "月",
    },
  ],
  [
    DATEUNIT.DAY,
    {
      res: (second: number) =>
        Math.ceil(Number(format(second / 1000 / 86400, 14))),
      unit: "日",
    },
  ],
  [
    DATEUNIT.HOUR,
    {
      res: (second: number) =>
        Math.ceil(number(format(second / 1000 / 3600, 14)) as number),
      unit: "时",
    },
  ],
  [
    DATEUNIT.MINUTE,
    {
      res: (second: number) =>
        Math.ceil(number(format(second / 1000 / 60, 14)) as number),
      unit: "分",
    },
  ],
]);

// 数值计算前五种
const numberCommonMap = new Map([
  // 求和
  [
    METHOD.ADDANDBETWWEN,
    {
      getRes: () => {
        const valueArr = props.item.widgetForNumber.map(id => props.value[id]);
        if (valueArr && valueArr.length > 0) {
          const res = valueArr.reduce((x, y) => Number(x) + Number(y));
          return formatNumber(
            number(format(res, 14)) as number,
            props.item.scale!
          );
        }
        return null;
      },
    },
  ],
  // 求差
  [
    METHOD.CUT,
    {
      getRes: () => {
        const valueArr = props.item.widgetForNumber.map(id => props.value[id]);

        if (valueArr!.some(item => item === "null" || item === null))
          return "0";
        const res = valueArr!.reduce(
          (prev, item, index) =>
            index === 0 ? (prev -= 0) : (prev -= item || 0),
          valueArr![0]
        );
        return formatNumber(
          number(format(res, 14)) as number,
          props.item.scale!
        );
      },
    },
  ],
  // 平均值
  [
    METHOD.AVERAGEANDDATESUB,
    {
      getRes: () => {
        const valueArr: Array<number | string> = [];
        props.item.widgetForNumber.forEach(item => {
          if (props.value[item]) {
            valueArr.push(Number(props.value[item]));
          }
        });
        if (valueArr && valueArr.length > 0) {
          let res: any = valueArr.reduce((x, y) => Number(x) + Number(y));
          res = divide(res, props.item.widgetForNumber.length);
          return formatNumber(
            number(format(res, 14)) as number,
            props.item.scale
          );
        }
        return null;
      },
    },
  ],
  // 最小值
  [
    METHOD.MINANDTOTADAY,
    {
      getRes: () => {
        const valueArr: Array<number | string> = [];
        props.item.widgetForNumber.forEach(item => {
          if (props.value[item]) {
            valueArr.push(Number(props.value[item]));
          }
        });
        if (valueArr && valueArr.length > 0) {
          valueArr.sort((a, b) => Number(a) - Number(b));
          return formatNumber(
            number(format(valueArr[0], 14)) as number,
            props.item.scale!
          );
        }
        return null;
      },
    },
  ],
  // 最大值
  [
    METHOD.MAX,
    {
      getRes: () => {
        const valueArr: Array<number | string> = [];
        props.item.widgetForNumber.forEach(item => {
          if (props.value[item]) {
            valueArr.push(Number(props.value[item]));
          }
        });
        if (valueArr && valueArr.length > 0) {
          valueArr.sort((a, b) => Number(b) - Number(a));
          return formatNumber(
            number(format(valueArr[0], 14)) as number,
            props.item.scale!
          );
        }
        return null;
      },
    },
  ],
  // 乘积 ok
  [
    METHOD.PRODUCT,
    {
      getRes: () => {
        const valueArr = props.item.widgetForNumber
          .map(id => props.value[id])
          .filter(i => Boolean(i));
        if (valueArr && valueArr.length > 0) {
          const res = valueArr.reduce((x, y) => Number(x) * Number(y));
          return formatNumber(
            number(format(res, 14)) as number,
            props.item.scale!
          );
        }
        return null;
      },
    },
  ],
  // 除法
  [
    METHOD.MOD,
    {
      getRes: () => {
        const valueArr = props.item.widgetForNumber.map(id => props.value[id]);
        if (valueArr?.some(item => !Number(item))) return "0";
        const res = valueArr?.reduce(
          (prev, item, index) => (index === 0 ? (prev /= 1) : (prev /= item)),
          valueArr[0]
        );
        return formatNumber(
          number(format(res, 14)) as number,
          props.item.scale!
        );
      },
    },
  ],
]);

// 自定义数值计算
function getCusTom() {
  return "";
}

// 计算公式值
function getLatestValue(lastedValue: Record<string, any>) {
  model.value = lastedValue;

  let value: MathType | string | null;

  // 数值计算
  if (props.item.type === NUM.SINGLE) {
    // 七种数值
    if (props.item.method !== METHOD.CUSTOM) {
      value = numberCommonMap.get(props.item.method)!.getRes();
      // 自定义数值
    } else {
      value = getCusTom();
    }
    // 日期计算
  } else {
    //  返回时间戳
    const result = FormulaResult.dateFormula(model.value, props.item);
    
    // 未返回时间戳就是null
    if (result === null || result === undefined) {
      value = null;
      return;
    }

    // 一三种
    const res = [METHOD.ADDANDBETWWEN, METHOD.MINANDTOTADAY].some(
      item => item === props.item.method
    )
      ? dateModeMap.get(props.item.dateUnit!)?.res(result as number)
      : selfDateModeMap.get(props.item.betweenMode!)?.getRes(result as number);

    value = typeof res === "string" || typeof res === "number" ? res : null;
  }
  

  // 只有值实际变化后才发”field-change“，避免无限死循环
  // if (String(props.value[props.item.id]) == String(value)) {
  // if (isNaN(Number(value))) {
  //   if (
  //     !["string", "number"].some(i => i === typeof model.value![props.item.id])
  //   ) {
  //     props.value[props.item.id] = "";
  //   }
  // } else {
  props.value[props.item.id] = value;
  

  // }
  // }
}
watch(
  () => [...props.item.widgetForNumber.map(widget => props.value[widget])],
  newV => {
    
    getLatestValue(props.value);
  }
);

onMounted(() => {
  getLatestValue(props.value);
  // props.value[props.item.id] = props.item.unit;
});
</script>

<style>
.right {
  float: right;
  color: #d5d5d5;
}
</style>
