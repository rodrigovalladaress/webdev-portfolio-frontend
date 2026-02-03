// import gsap from "gsap";
import Color from "~/experience/Color";
import type { ColorEventDetail } from "~/experience/types/color";

export const COLORS = {
  blue: { l: 0.675, c: 0.25, h: 264 },
  yellow: { l: 0.9, c: 0.19, h: 100 },
  pink: { l: 0.75, c: 0.22, h: 350 },
  green: { l: 0.86645, c: 0.2948, h: 142.511 },
};

export type ColorKey = keyof typeof COLORS;

export const COLOR_KEYS = Object.freeze(Object.keys(COLORS)) as readonly ColorKey[];

const emitter = new EventEmitter<ColorEventDetail>(Color.CHANGE_COLOR_EVENT_NAME);

export default (color: ColorKey) => {
  const { l, c, h } = COLORS[color];
  // Delegate transitioning from one color to another to a CSS transition...
  injectCssVariable("--color-primary-l", l.toString());
  injectCssVariable("--color-primary-c", c.toString());
  injectCssVariable("--color-primary-h", h.toString());

  // ... but dispatch the color change event so the ThreeJS experience
  // can manually lerp from one color to another
  emitter.dispatch({ color });
};
