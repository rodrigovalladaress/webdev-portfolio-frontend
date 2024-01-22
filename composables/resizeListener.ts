// I can't see any difference after debouncing the resize listener,
// but keeping this anyway
export const useResizeListener = (callback?: Function) => {
  return createDebouncedListener("resize", callback);
};
