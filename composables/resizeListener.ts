export const useResizeListener = (callback?: Function) => {
  let removeInternal: (() => void) | null;

  const addInternal = (callbackInternal: Function) => {
    removeInternal = EventListener.addDebounced("resize", callbackInternal).remove;
  };

  if (callback) {
    addInternal(callback);
  }

  return {
    add: (callback: Function) => {
      addInternal(callback);
    },

    remove: () => {
      if (!removeInternal) {
        // eslint-disable-next-line no-console
        console.warn("Can't remove resize listener because it's not initialized");
        return;
      }

      removeInternal();
    },
  };
};
