import EventEmitter from "./EventEmitter";
import type { ResizeEvent } from "./types/resize";

export default class Sizes {
  public static readonly EVENT_NAME = "threeExperience:resize";

  private event: EventEmitter<ResizeEvent>;

  public constructor() {
    this.event = new EventEmitter(Sizes.EVENT_NAME);

    window.addEventListener("resize", () => {
      console.log("resize");

      this.event.dispatch(Sizes.getSizes());
    });
  }

  public static getSizes(): ResizeEvent {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Sizes.getPixelRatio(),
    };
  }

  public static getPixelRatio() {
    return Math.min(window.devicePixelRatio, 2);
  }
}
