// https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript

export type BreakpointName = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export const useBreakpoint = () => {
  const currentBreakpoint = ref<BreakpointName>("xs");
  const currentBreakpointValue = ref("0");

  if (process.client) {
    const updateBreakpoint = () => {
      // These values are injected in _inject-breakpoints.scss
      const { content: _content, width } = window.getComputedStyle(document.body, ":before");
      const content = _content.replace(/"/g, "");

      currentBreakpoint.value = content as BreakpointName;
      currentBreakpointValue.value = width;
    };

    window.addEventListener("resize", () => {
      updateBreakpoint();
    });

    updateBreakpoint();
  }

  return { breakpoint: currentBreakpoint, value: currentBreakpointValue };
};
