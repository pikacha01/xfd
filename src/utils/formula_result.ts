import { evaluate } from "mathjs";
import { Content, CONTENTTYPE, METHOD, NUM } from "@/constants/form";

class FormulaResult {
  /**
   * 计算公式控件的日期值
   * @param value 填写表单的值
   * @param beginDate 开始时间
   * @param endDate 结束时间
   */
  dateFormula(value: Record<string, any>, widget: any) {
    const { beginDateContent, endDateContent } = widget;
    return this.dateMap.get(widget.method)?.result(value, widget, beginDateContent, endDateContent);
  }

  dataFormalMap = new Map([
    // 年
    [
      "Y",
      {
        handle: (date: string) => {
          const time = date.substr(0, date.length - 1);
          if (!isNaN(Number(time))) {
            return Number(time) * 365 * 24 * 60 * 60 * 1000;
          }
          return 0;
        }
      }
    ],
    // 月
    [
      "M",
      {
        handle: (date: string) => {
          const time = date.substr(0, date.length - 1);
          if (!isNaN(Number(time))) {
            return Number(time) * 30 * 24 * 60 * 60 * 1000;
          }
          return 0;
        }
      }
    ],
    // 天
    [
      "d",
      {
        handle: (date: string) => {
          const time = date.substr(0, date.length - 1);
          if (!isNaN(Number(time))) {
            return Number(time) * 24 * 60 * 60 * 1000;
          }
          return 0;
        }
      }
    ],
    // 小时
    [
      "h",
      {
        handle: (date: string) => {
          const time = date.substr(0, date.length - 1);
          if (!isNaN(Number(time))) {
            return Number(time) * 60 * 60 * 1000;
          }
          return 0;
        }
      }
    ],
    // 分
    [
      "m",
      {
        handle: (date: string) => {
          const time = date.substr(0, date.length - 1);
          if (!isNaN(Number(time))) {
            return Number(time) * 60 * 1000;
          }
          return 0;
        }
      }
    ]
  ]);

  dateMap = new Map([
    // 两日期间的时间
    [
      METHOD.ADDANDBETWWEN,
      {
        result: (
          value: Record<string, any>,
          _: any,
          begin: Array<Content> | null,
          end: Array<Content> | null
        ): number | null => {
          // 一个没有值就是null；
          if (!begin || !end) {
            return null;
          }

          return Math.abs(this.handleData(value, begin) - this.handleData(value, end));
        }
      }
    ],

    // 为日期加减时间
    [
      METHOD.AVERAGEANDDATESUB,
      {
        result: (
          value: Record<string, any>,
          _: any,
          begin: Array<Content> | null,
          end: Array<Content> | null
        ) => {
          // 没有目标值
          if (!begin || begin.length === 0) {
            return null;
          }
          let operationData;
          if (begin[0].type === CONTENTTYPE.INPUT) {
            operationData = (begin[0] as Record<string, any>).value;
          } else {
            // @ts-ignore
            const targetWidgetId = begin[0].value[0].value;
            operationData = value[targetWidgetId] ?? null;
          }
          if (operationData !== null) {
            const time = new Date(`${operationData} 00:00:00`).getTime();
            const timeFormula = end?.filter(
              (item) =>
                item.type === CONTENTTYPE.OPERATOR || (item as Record<string, any>).value !== ""
            );
            const formulaRes = timeFormula?.reduce((prev, item) => {
              if (item.type === CONTENTTYPE.OPERATOR) {
                return `${prev}${(item as Record<string, any>).operator}`;
              }
              const { value } = item as Record<string, any>;
              const result = this.dataFormalMap.get(value.charAt(value.length - 1))?.handle(value);
              return +prev + result
              // return `${prev}${String(result)}`;
            }, String(time));
            return formulaRes

            // return evaluate(formulaRes || "");
          }
          return null;
        }
      }
    ],

    // 距离今天的日期
    [
      METHOD.MINANDTOTADAY,
      {
        result: (
          value: Record<string, any>,
          widget: any,
          begin: Array<Content> | null,
          _: Array<Content> | null
        ) => {
          if (!begin) {
            return null;
          }

          const armDate = this.handleData(value, begin);

          const nowData = Date.parse(String(new Date()));

          const diff = widget.betweenMode === NUM.SINGLE ? armDate - nowData : nowData - armDate;

          if (widget.showNegative && diff < 0) {
            return null;
          }
          return diff;
        }
      }
    ]
  ]);

  // 处理时间(日期格式或是控件值)
  handleData(value: Record<string, any>, date: Array<Content> | null): number {
    if (!date) {
      return 0;
    }
    if (date[0].type === CONTENTTYPE.INPUT) {
      return Date.parse((date[0] as Record<string, any>).value);
    }
    return value[(date[0] as Record<string, any>).value[0].value]
      ? Date.parse(value[(date[0] as Record<string, any>).value[0].value])
      : 0;
  }
}

export default new FormulaResult();
