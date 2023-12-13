import * as THREE from "three";

import type { ResizeEventDetail as ScreenSize } from "./types/resize";

export default class Renderer {
  private renderer: THREE.WebGLRenderer;

  public constructor(canvas: HTMLCanvasElement, size: ScreenSize, clearColor: THREE.Color = new THREE.Color(0x000)) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;

    this.renderer.setClearColor(clearColor);
    this.resize(size);
  }

  public resize(size: ScreenSize) {
    this.renderer.setSize(size.width, size.height);
    this.renderer.setPixelRatio(size.pixelRatio);
  }

  public update(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
  }

  public dispose() {
    this.renderer.dispose();
  }
}
