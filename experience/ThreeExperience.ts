import * as THREE from "three";
import Sizes from "./Sizes";
import type { ResizeEvent } from "./types/resize";
import Time from "./Time";

export default class ThreeExperience {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private sizes: Sizes;
  private time: Time;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.sizes = new Sizes();
    this.time = new Time();

    this.scene = new THREE.Scene();

    window.addEventListener(Sizes.EVENT_NAME, ((e: CustomEvent<ResizeEvent>) => {
      console.log("three js resizes", e.detail);
    }) as EventListener);

    console.log("canvas", canvas);
  }
}
