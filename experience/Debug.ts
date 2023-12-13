import Gui from "lil-gui";

export default class Debug {
  private static _isActive: boolean;
  // private static _isAlreadyInitialized: boolean;
  private static _instance: Gui | null = null;

  public static get instance() {
    return Debug._instance;
  }

  // public static get isAlreadyInitialized() {
  //   return Debug._isAlreadyInitialized;
  // }

  private static set instance(value: Gui | null) {
    Debug._instance = value;
  }

  public constructor() {
    Debug._isActive = window.location.hash === "#debug";
    // Debug._isAlreadyInitialized = false;

    if (Debug.isActive) {
      Debug.initializeSpectorJS();

      // Prevent nuxt adding another instance of lil-gui when the code changes
      if ((window as any).__lilGui) {
        (window as any).__lilGui.destroy();
        (window as any).__lilGui = null;
      }

      Debug.instance = new Gui({});

      Debug.instance.open();

      Debug.instance.domElement.style.top = "inherit";
      Debug.instance.domElement.style.right = "0";
      Debug.instance.domElement.style.bottom = "0";

      (window as any).__lilGui = Debug.instance;
    } else {
      Debug.instance = null;
    }
  }

  private static initializeSpectorJS() {
    const id = "__SPECTOR_JS__";

    if (document.querySelector(`#${id}`)) {
      Debug.onSpectorJsLoaded();

      return;
    }

    const s = document.createElement("script");
    s.id = id;
    s.src = "https://spectorcdn.babylonjs.com/spector.bundle.js";

    document.head.appendChild(s);

    s.addEventListener("load", () => {
      this.onSpectorJsLoaded();
    });
  }

  private static onSpectorJsLoaded() {
    const spector = new (window as any).SPECTOR.Spector();
    spector.displayUI();
  }

  public static get isActive() {
    return Debug._isActive;
  }
}
