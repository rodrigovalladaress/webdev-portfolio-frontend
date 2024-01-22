// Scroll events are supposed to be already throttled? But keeping this
export const useScrollListener = (callback?: Function) => {
  return createThrottledListener("scroll", callback);
};
