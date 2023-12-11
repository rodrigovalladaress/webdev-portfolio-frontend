import * as THREE from "three";
import Size from "./Size";
import type { ResizeEventDetail } from "./types/resize";
import Time from "./Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import type { TimeTickEventDetail } from "./types/time";

export default class ThreeExperience {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private size: Size;
  private time: Time;
  private camera: Camera;
  private renderer: Renderer;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.size = new Size();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.camera = new Camera(canvas, this.scene, Size.data);
    this.renderer = new Renderer(canvas, Size.data);

    // TODO remove, test that the camera works
    this.scene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: "green" })));

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
    console.log("resize");

    this.camera.resize(resizeData);
    this.renderer.resize(resizeData);
  }

  private update(_timeTickData: TimeTickEventDetail) {
    this.camera.update();
    this.renderer.update(this.scene, this.camera.instance);
  }
}
