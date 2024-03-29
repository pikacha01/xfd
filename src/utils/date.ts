// 格式化时间戳  yyyy-MM-dd hh:mm:ss
const formatter = <T>(date: T, fmt: string): Date | string => {
    const $this = new Date(date as unknown as string);
    const o = {
      "M+": $this.getMonth() + 1,
      "d+": $this.getDate(),
      "h+": $this.getHours(),
      "m+": $this.getMinutes(),
      "s+": $this.getSeconds(),
      "q+": Math.floor(($this.getMonth() + 3) / 3),
      S: $this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, `${$this.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
        );
      }
    }
    return fmt;
  };
  
  export { formatter };
  