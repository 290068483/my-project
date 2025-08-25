// 防抖函数
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number = 300): T {
  let timer: number | null = null;

  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  } as T;
}

// 节流函数
function throttle<T extends (...args: any[]) => any>(fn: T, interval: number = 300): T {
  let lastTime = 0;
  let timer: number | null = null;

  return function (this: any, ...args: any[]) {
    const nowTime = Date.now();
    const remaining = interval - (nowTime - lastTime);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = nowTime;
    } else if (!timer) {
      timer = window.setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, remaining);
    }
  } as T;
}

export { debounce, throttle };
