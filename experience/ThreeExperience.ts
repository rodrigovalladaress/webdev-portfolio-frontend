import * as THREE from "three";

import Size from "./Size";
import type { ResizeEventDetail } from "./types/resize";
import type { TimeTickEventDetail } from "./types/time";
import Time from "./Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World";
import Debug from "./Debug";
import EventListener from "./EventListener";

export default class ThreeExperience {
  private scene: THREE.Scene;
  private size: Size;
  private time: Time;
  private camera: Camera;
  private world: World;
  private renderer: Renderer;

  public constructor(canvas: HTMLCanvasElement) {
    Debug.initialize();

    this.size = new Size();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.camera = new Camera(canvas, this.scene, Size.data);
    this.world = new World(this.scene);
    this.renderer = new Renderer(canvas, Size.data);

    EventListener.add(Size.RESIZE_EVENT_NAME, this.onResize.bind(this));
    EventListener.add(Time.TICK_EVENT_NAME, this.onTick.bind(this));

    this.resize(Size.data);
    this.update(this.time.data);

    // Keep GUI values between Nuxt reloads
    // This needs to be called after all the other classes add their elements
    // to the GUI, so they can be overriden here
    Debug.restorePreviousGuiValues();
  }

  private onResize(e: CustomEvent<ResizeEventDetail>) {
    this.resize(e.detail);
  }

  private onTick(e: CustomEvent<TimeTickEventDetail>) {
    this.update(e.detail);
  }

  private resize(resizeData: ResizeEventDetail) {
    this.camera.resize(resizeData);
    this.renderer.resize(resizeData);
  }

  private update(time: TimeTickEventDetail) {
    this.camera.update();
    this.world.update(time);
    this.renderer.update(this.scene, this.camera.instance);
  }

  public destroy() {
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        (child.geometry as THREE.BufferGeometry).dispose();

        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.renderer.dispose();

    EventListener.removeAll();

    Debug.destroy();
  }
}
