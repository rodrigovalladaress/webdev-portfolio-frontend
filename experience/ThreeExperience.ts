import * as THREE from "three";
import Size from "./Size";
import type { ResizeEventDetail } from "./types/resize";
import type { TimeTickEventDetail } from "./types/time";
import Time from "./Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World";

export default class ThreeExperience {
  private scene: THREE.Scene;
  private size: Size;
  private time: Time;
  private camera: Camera;
  private world: World;
  private renderer: Renderer;

  public constructor(canvas: HTMLCanvasElement) {
    this.size = new Size();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.camera = new Camera(canvas, this.scene, Size.data);
    this.world = new World(this.scene);
    this.renderer = new Renderer(canvas, Size.data);

    window.addEventListener(Size.RESIZE_EVENT_NAME, ((e: CustomEvent<ResizeEventDetail>) => {
      this.resize(e.detail);
    }) as EventListener);

    window.addEventListener(Time.TICK_EVENT_NAME, ((e: CustomEvent<TimeTickEventDetail>) => {
      this.update(e.detail);
    }) as EventListener);

    this.resize(Size.data);
    this.update(this.time.data);
  }

  private resize(resizeData: ResizeEventDetail) {
    this.camera.resize(resizeData);
    this.renderer.resize(resizeData);
  }

  private update({ delta }: TimeTickEventDetail) {
    this.camera.update();
    this.world.update(delta);
    this.renderer.update(this.scene, this.camera.instance);
  }
}
