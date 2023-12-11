import EventEmitter from "./EventEmitter";
import { OPTIONS } from "./options";
import type { TimeTickEventDetail } from "./types/time";

export default class Time {
  public static readonly TICK_EVENT_NAME = "threeExperience:tick";

  private current: number;
  private delta: number;
  private deltaMs: number;

  private event: EventEmitter<TimeTickEventDetail>;

  public constructor() {
    this.current = Time.getCurrentTime();
    this.deltaMs = 1000 / OPTIONS.targetFPS;
    this.delta = Time.toSeconds(this.deltaMs);

    this.event = new EventEmitter(Time.TICK_EVENT_NAME);

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  private dispatchEvent() {
    this.event.dispatch(this.data);
  }

  private tick() {
    const currentTime = Time.getCurrentTime();
    this.deltaMs = currentTime - this.current;
    this.delta = Time.toSeconds(this.deltaMs);
    this.current = currentTime;

    this.dispatchEvent();

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  public get data(): TimeTickEventDetail {
    return {
      delta: this.delta,
      deltaMs: this.deltaMs,
    };
  }

  private static getCurrentTime() {
    return Date.now();
  }

  private static toSeconds(ms: number) {
    return ms / 1000;
  }
}
