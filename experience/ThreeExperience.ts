import * as THREE from "three";
import Sizes from "./Sizes";
import type { ResizeEvent } from "./types/resize";

export default class ThreeExperience {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private sizes: Sizes;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.sizes = new Sizes();

    window.addEventListener(Sizes.EVENT_NAME, ((e: CustomEvent<ResizeEvent>) => {
      console.log("three js resizes", e.detail);
    }) as EventListener);

    console.log("canvas", canvas);
  }
}
