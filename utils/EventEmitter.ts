export default class EventEmitter<T extends object> {
  private eventName: string;

  public constructor(eventName: string) {
    this.eventName = eventName;
  }

  public dispatch(data: T) {
    return window.dispatchEvent(this.createEvent(data));
  }

  private createEvent(data: T) {
    return new CustomEvent<T>(this.eventName, {
      detail: data,
    });
  }
}
