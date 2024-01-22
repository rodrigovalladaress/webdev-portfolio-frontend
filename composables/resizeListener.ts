// I can't see any difference after throttling the resize listener,
// but keeping this anyway
export const useResizeListener = (callback?: Function) => {
  return createThrottledListener("resize", callback);
};
