import Gui from "lil-gui";

type SpectorJs = {
  displayUI: () => void;
};

type DebugWindow = Window &
  typeof globalThis & {
    __guiValues__: object | null | undefined;
    SPECTOR: { Spector: { new (): SpectorJs } } | undefined;
    __debugSpectorJs__: SpectorJs | null | undefined;
  };

export default class Debug {
  private static readonly SPECTOR_JS_TAG_ID = "__SPECTOR_JS__";

  private static _isActive: boolean;
  private static _guiInstance: Gui | null = null;

  public static get isActive() {
    return Debug._isActive;
  }

  public static get guiInstance(): Gui | null {
    return Debug._guiInstance;
  }

  private static set guiInstance(value: Gui | null) {
    Debug._guiInstance = value;
  }

  // Keep the values of the previous gui instances in window so it's possible to
  // apply them again when nuxt reloads the code
  private static get guiValues() {
    return (window as DebugWindow).__guiValues__;
  }

  private static set guiValues(value: object | null | undefined) {
    (window as DebugWindow).__guiValues__ = value;
  }

  // Keep the Spector.js instance in window as it's not possible to destroy it and
  // add it again
  public static get spectorJsInstance() {
    return (window as DebugWindow).__debugSpectorJs__;
  }

  private static set spectorJsInstance(value: DebugWindow["__debugSpectorJs__"]) {
    (window as DebugWindow).__debugSpectorJs__ = value;
  }

  public static initialize() {
    Debug._isActive = window.location.hash === "#debug";

    if (Debug.isActive) {
      Debug.initializeGui();
      Debug.addSpectorJsButton();
    }
  }

  private static initializeGui() {
    Debug.guiInstance = new Gui();
    Debug.guiInstance.open();

    Debug.guiInstance.domElement.style.top = "inherit";
    Debug.guiInstance.domElement.style.right = "0";
    Debug.guiInstance.domElement.style.bottom = "0";
  }

  public static restorePreviousGuiValues() {
    if (Debug.guiValues) {
      Debug.guiInstance?.load(Debug.guiValues);
    }
  }

  private static addSpectorJsButton() {
    const folder = Debug.guiInstance?.addFolder("Spector.js");
    folder?.add({ initializeSpectorJs: Debug.initializeSpectorJS }, "initializeSpectorJs").name("Open Spector.js");
  }

  private static initializeSpectorJS() {
    // Avoid creating more than one Spector JS instance
    if (Debug.spectorJsInstance) {
      return;
    }

    if (document.querySelector(`#${Debug.SPECTOR_JS_TAG_ID}`)) {
      Debug.onSpectorJsLoaded();

      return;
    }

    // The npm version of Spector.js doesn't work on Firefox, so load
    // the cdn bundle version instead
    const s = document.createElement("script");
    s.id = Debug.SPECTOR_JS_TAG_ID;
    s.src = "https://spectorcdn.babylonjs.com/spector.bundle.js";

    document.head.appendChild(s);

    s.addEventListener("load", () => {
      Debug.onSpectorJsLoaded();
    });
  }

  private static onSpectorJsLoaded() {
    const { SPECTOR } = window as DebugWindow;
    if (!SPECTOR) {
      throw new Error("SPECTOR class is not defined in window");
    }

    Debug.spectorJsInstance = new SPECTOR.Spector() as SpectorJs;
    Debug.spectorJsInstance.displayUI();
  }

  public static destroy() {
    // Save the gui values in window before nuxt reloads the code
    Debug.guiValues = Debug.guiInstance?.save(true);
    Debug.guiInstance?.destroy();
  }
}
