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

    return {
      remove: () => {
        EventListener.remove(eventName, callback);
      },
    };
  }

  // https://gomakethings.com/debouncing-events-with-requestanimationframe-for-better-performance/
  public static addDebounced(
    eventName: string,
    callback: (typeof EventListener.instance.listeners)[number]["callback"],
  ) {
    let timeout: number;
    const debouncedCallback = () => {
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }

      timeout = window.requestAnimationFrame(callback);
    };

    EventListener.instance.listeners.push({ eventName, callback: debouncedCallback });

    window.addEventListener(eventName, debouncedCallback);

    return {
      remove: () => {
        EventListener.remove(eventName, debouncedCallback);
      },
    };
  }

  private static findIndex(eventName: string, callback: (typeof EventListener.instance.listeners)[number]["callback"]) {
    const index = EventListener.instance.listeners.findIndex(
      (l) => l.eventName === eventName && l.callback === callback,
    );

    return index;
  }

  public static remove(eventName: string, callback: (typeof EventListener.instance.listeners)[number]["callback"]) {
    const index = EventListener.findIndex(eventName, callback);
    if (index === -1) {
      // eslint-disable-next-line no-console
      console.warn(`Couldn't remove listener with event name '${eventName}', as it wasn't found`);
      return;
    }

    EventListener.instance.listeners.splice(index, 1);
    window.removeEventListener(eventName, callback);
  }

  public static removeAll() {
    for (const { eventName, callback } of EventListener.instance.listeners) {
      window.removeEventListener(eventName, callback);
    }
  }
}
