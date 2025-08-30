/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

/**
 * 日期格式化
 * @param time 时间
 * @param pattern 格式化模式
 * @returns 格式化后的时间字符串
 */
export function parseTime(time: string | number | Date | null | undefined, pattern?: string): string | null {
  if (arguments.length === 0 || !time) {
    return null;
  }
  
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date: Date;
  
  if (typeof time === 'object') {
    date = time as Date;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time, 10);
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  
  const formatObj: Record<string, number> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { 
      return ['日', '一', '二', '三', '四', '五', '六'][value] as string; 
    }
    if (result.length > 0 && value < 10) {
      value = parseInt('0' + value, 10);
    }
    return String(value || 0);
  });
  
  return time_str;
}

/**
 * 表单重置
 * @param formRef 表单引用
 */
export function resetForm(formRef: any): void {
  if (formRef) {
    formRef.resetFields();
  }
}

/**
 * 添加日期范围
 * @param params 参数
 * @param dateRange 日期范围
 * @param propName 属性名
 * @returns 处理后的参数
 */
export function addDateRange(params: any, dateRange: any[], propName: string = "params"): any {
  const search = params || {};
  search[propName] = {};
  if (dateRange && dateRange.length === 2) {
    search.beginTime = dateRange[0];
    search.endTime = dateRange[1];
  }
  return search;
}

/**
 * 回显数据字典
 * @param datas 数据源
 * @param value 值
 * @returns 字典标签
 */
export function selectDictLabel(datas: any[], value: string): string {
  if (value === undefined) {
    return "";
  }
  const actions = datas.filter((item) => item.value === value);
  if (actions.length > 0) {
    return actions[0].label;
  } else {
    return "";
  }
}

/**
 * 回显数据字典（字符串数组）
 * @param datas 数据源
 * @param value 值
 * @returns 字典标签
 */
export function selectDictLabels(datas: any[], value: string, separator: string = ","): string {
  if (value === undefined || value.length === 0) {
    return "";
  }
  if (Array.isArray(value)) {
    value = value.join(",");
  }
  const actions: string[] = [];
  value.split(",").forEach((val) => {
    const match = datas.find((item) => item.value === val);
    if (match) {
      actions.push(match.label);
    }
  });
  return actions.join(separator);
}

/**
 * 字符串格式化(%s )
 * @param str 字符串
 * @param args 参数
 * @returns 格式化后的字符串
 */
export function sprintf(str: string, ...args: any[]): string {
  let i = 0;
  return str.replace(/%s/g, () => {
    return args[i++];
  });
}

/**
 * 转换字符串，undefined,null等转化为""
 * @param str 字符串
 * @returns 转换后的字符串
 */
export function parseStrEmpty(str: string | undefined | null): string {
  if (!str || str === "undefined" || str === "null") {
    return "";
  }
  return str;
}

/**
 * 数据合并
 * @param source 源数据
 * @param target 目标数据
 * @returns 合并后的数据
 */
export function mergeRecursive(source: any, target: any): any {
  for (const p in target) {
    try {
      if (target[p].constructor === Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        source[p] = target[p];
      }
    } catch(e) {
      source[p] = target[p];
    }
  }
  return source;
}