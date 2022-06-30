let throttlePause = false;

export const throttle = (callback: () => void, time: number) => {
  if (throttlePause) return;

  throttlePause = true;
  setTimeout(() => {
    callback();
    throttlePause = false;
  }, time);
};

let debounceTimer: number;

export const debounce = (callback: () => void, time: number) => {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(callback, time);
};
