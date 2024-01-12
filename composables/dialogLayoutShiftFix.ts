// Prevents a layout shift (the page to scrolls to the top) when a dialog is opened.
// See _dialog-layout-shift-fix.scss too.
// https://stackoverflow.com/questions/55979512/html-dialog-element-scroll-content-independently-of-background
// https://www.reddit.com/r/css/comments/137kr90/is_there_a_way_to_prevent_scrollthrough_when/

export const useDialogLayoutShiftFix = () => {
  const root = process.client ? document.documentElement : null;

  let verticalScroll = 0;
  let ownHeaderElement: HTMLElement | null = null;

  const getScrollbarWidth = () => {
    if (!process.client) {
      return 0;
    }

    return window.innerWidth - document.documentElement.clientWidth;
  };

  const injectScrollbarWidth = () => {
    if (!process.client || !root) {
      return;
    }

    root.style.setProperty("--scrollbar-width", `${getScrollbarWidth()}px`);
  };

  injectScrollbarWidth();

  return {
    saveScroll: () => {
      if (!process.client || !document.scrollingElement) {
        return;
      }

      verticalScroll = document.scrollingElement.scrollTop;
    },

    injectScroll: () => {
      if (!process.client || !document.scrollingElement || !root) {
        return;
      }

      root.style.setProperty("--scroll-y-fix", `${verticalScroll}px`);
    },

    restoreScroll: () => {
      if (!process.client || !document.scrollingElement) {
        return;
      }

      document.scrollingElement.scrollTop = verticalScroll;
    },

    injectHeaderHeight: () => {
      if (!process.client || !root || !ownHeaderElement) {
        return;
      }

      root.style.setProperty("--header-height", `${ownHeaderElement.getBoundingClientRect().height}px`);
    },

    updateHeaderElement: (headerElement: HTMLElement | null) => {
      ownHeaderElement = headerElement;
    },

    recalculateScrollbarWidth: () => {
      injectScrollbarWidth();
    },
  };
};
