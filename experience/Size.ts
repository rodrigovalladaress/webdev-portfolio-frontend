import EventEmitter from "./EventEmitter";
import type { ResizeEventDetail } from "./types/resize";

export default class Size {
  public static readonly RESIZE_EVENT_NAME = "threeExperience:resize";

  private event: EventEmitter<ResizeEventDetail>;

  public constructor() {
    this.event = new EventEmitter(Size.RESIZE_EVENT_NAME);

    window.addEventListener("resize", () => {
      this.dispatchEvent();
    });
  }

  private dispatchEvent() {
    this.event.dispatch(Size.data);
  }

  public static get data(): ResizeEventDetail {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Size.pixelRatio,
    };
  }

  public static get pixelRatio() {
    // Three JS Journey recommends limiting the pixel ratio to 2
    return Math.min(window.devicePixelRatio, 2);
  }
}
