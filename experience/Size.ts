import type { ResizeEventDetail } from "./types/resize";
import EventEmitter from "~/experience/EventEmitter";
import EventListener from "~/utils/EventListener";

export default class Size {
  private static readonly DEBOUNCE_RESIZE_EVENTS_MS = 200;

  public static readonly RESIZE_EVENT_NAME = "threeExperience:resize";

  private event: EventEmitter<ResizeEventDetail>;

  public constructor() {
    this.event = new EventEmitter(Size.RESIZE_EVENT_NAME);

    EventListener.addDebounced(
      "resize",
      () => {
        this.dispatchEvent();
      },
      Size.DEBOUNCE_RESIZE_EVENTS_MS,
    );
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
