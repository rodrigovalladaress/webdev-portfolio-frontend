import Color from "~/experience/Color";
import type { ColorEventDetail } from "~/experience/types/color";

export const COLORS = {
  blue: { l: 0.6768, c: 0.1708, h: 264 },
  yellow: { l: 0.9, c: 0.3, h: 100 },
  pink: { l: 0.7107, c: 0.272, h: 334.92 },
  green: { l: 0.86645, c: 0.2948, h: 142.511 },
};

export type ColorKey = keyof typeof COLORS;

export const COLOR_KEYS = Object.freeze(Object.keys(COLORS)) as readonly ColorKey[];

const emitter = new EventEmitter<ColorEventDetail>(Color.CHANGE_COLOR_EVENT_NAME);

export const usePrimaryColor = () => {
  const currentColor = useState<ColorKey>("color", () => "green");

  return {
    current: currentColor,
    change: (color: ColorKey) => {
      const { l, c, h } = COLORS[color];
      // Delegate transitioning from one color to another to a CSS transition...
      injectCssVariable("--color-primary-l", l.toString());
      injectCssVariable("--color-primary-c", c.toString());
      injectCssVariable("--color-primary-h", h.toString());

      // ... but dispatch the color change event so the ThreeJS experience
      // can manually lerp from one color to another
      emitter.dispatch({ color });

      currentColor.value = color;
    },
  };
};
