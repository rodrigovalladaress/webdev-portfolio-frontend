import * as THREE from "three";

export default class Camera {
  private camera: THREE.PerspectiveCamera;

  public constructor() {
    this.camera = new THREE.PerspectiveCamera(35, 0 / 2, 0.1, 100);
  }
}
