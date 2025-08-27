/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param date 要格式化的日期
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss 格式
 * @param dateTime 要格式化的日期时间（Date对象或时间戳字符串）
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (dateTime: Date | string | number): string => {
  if (!dateTime) return "";

  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * 获取当前日期的格式化字符串
 * @returns 当前日期的格式化字符串
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

/**
 * 获取星期几的中文表示
 * @param date 日期
 * @returns 星期几的中文表示
 */
export const getWeekDay = (date: Date): string => {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return `星期${weekdays[date.getDay()]}`;
};

/**
 * 获取包含星期的完整日期字符串
 * @returns 包含星期的完整日期字符串
 */
export const getFullDateWithWeekday = (): string => {
  const date = new Date();
  const dateString = formatDate(date);
  const weekday = getWeekDay(date);
  return `${dateString} ${weekday}`;
};
