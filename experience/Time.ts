import EventEmitter from "./EventEmitter";
import { OPTIONS } from "./options";
import type { TimeTickEventDetail } from "./types/time";

export default class Time {
  public static readonly TICK_EVENT_NAME = "threeExperience:tick";
  public static readonly FIRST_TICK_EVENT_NAME = "threeExperience:firstTick";

  private start: number;
  private current: number;
  private elapsed: number;
  private elapsedMs: number;
  private delta: number;
  private deltaMs: number;

  private tickEvent: EventEmitter<TimeTickEventDetail>;
  private firstTickEvent: EventEmitter<{}>;

  public constructor() {
    this.start = Date.now();
    this.current = Time.getCurrentTime();

    this.elapsed = 0;
    this.elapsedMs = 0;

    this.deltaMs = 1000 / OPTIONS.targetFPS;
    this.delta = Time.toSeconds(this.deltaMs);

    this.firstTickEvent = new EventEmitter(Time.FIRST_TICK_EVENT_NAME);
    this.tickEvent = new EventEmitter(Time.TICK_EVENT_NAME);

    window.requestAnimationFrame(() => {
      this.dispatchFirstTickEvent();
      this.tick();
    });
  }

  private dispatchFirstTickEvent() {
    this.firstTickEvent.dispatch({});
  }

  private dispatchTickEvent() {
    this.tickEvent.dispatch(this.data);
  }

  private tick() {
    const currentTime = Time.getCurrentTime();

    this.elapsedMs = currentTime - this.start;
    this.elapsed = Time.toSeconds(this.elapsedMs);

    this.deltaMs = currentTime - this.current;
    this.delta = Time.toSeconds(this.deltaMs);

    this.current = currentTime;

    this.dispatchTickEvent();

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  public get data(): TimeTickEventDetail {
    return {
      elapsed: this.elapsed,
      elapsedMs: this.elapsedMs,
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
