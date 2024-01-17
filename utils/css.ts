export const injectCssVariable = (name: string, value: string | null) => {
  if (!process.client) {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty(name, value);
};
