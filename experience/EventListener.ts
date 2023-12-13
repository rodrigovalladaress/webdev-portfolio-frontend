export default class EventListener {
  // eslint-disable-next-line no-use-before-define
  private static _instance: EventListener;

  private listeners: { eventName: string; callback: (typeof window.addEventListener)["arguments"][2] }[] = [];

  public static get instance(): EventListener {
    if (!EventListener._instance) {
      EventListener._instance = new EventListener();
    }

    return EventListener._instance;
  }

  public static set instance(value: EventListener) {
    EventListener._instance = value;
  }

  public static add(eventName: string, callback: (typeof EventListener.instance.listeners)[number]["callback"]) {
    EventListener.instance.listeners.push({ eventName, callback });

    window.addEventListener(eventName, callback);
  }

  public static removeAll() {
    for (const { eventName, callback } of EventListener.instance.listeners) {
      window.removeEventListener(eventName, callback);
    }
  }
}
