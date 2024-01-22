// Scroll events are supposed to be already debounced, but keeping this
export const useScrollListener = (callback?: Function) => {
  return createDebouncedListener("scroll", callback);
};
