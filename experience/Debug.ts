import Gui from "lil-gui";

export default class Debug {
  private _isActive: boolean;
  private instance: Gui | null;

  public constructor() {
    this._isActive = window.location.hash === "#debug";

    if (this.isActive) {
      // Prevent nuxt adding another instance of lil-gui when the code changes
      if ((window as any).__lilGui) {
        this.instance = (window as any).__lilGui as Gui;

        return;
      }

      this.instance = new Gui({});

      this.instance.open();

      this.instance.domElement.style.top = "inherit";
      this.instance.domElement.style.right = "0";
      this.instance.domElement.style.bottom = "0";

      (window as any).__lilGui = this.instance;
    } else {
      this.instance = null;
    }
  }

  public get isActive() {
    return this._isActive;
  }
}
