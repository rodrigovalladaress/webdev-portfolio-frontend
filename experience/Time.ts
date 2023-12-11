import EventEmitter from "./EventEmitter";
import { OPTIONS } from "./options";
import type { TimeTickEvent } from "./types/time";

export default class Time {
  public static readonly EVENT_NAME = "threeExperience:tick";

  private current: number;
  private delta: number;
  private deltaMs: number;

  private event: EventEmitter<TimeTickEvent>;

  public constructor() {
    this.current = Time.getCurrentTime();
    this.deltaMs = 1000 / OPTIONS.targetFPS;
    this.delta = Time.toSeconds(this.deltaMs);

    this.event = new EventEmitter(Time.EVENT_NAME);

    window.requestAnimationFrame(() => {
      this.tick();
    });

    // Simulate first tick
    this.dispatchEvent();
  }

  private dispatchEvent() {
    this.event.dispatch({
      delta: this.delta,
      deltaMs: this.deltaMs,
    });
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

  private static getCurrentTime() {
    return Date.now();
  }

  private static toSeconds(ms: number) {
    return ms / 1000;
  }
}
