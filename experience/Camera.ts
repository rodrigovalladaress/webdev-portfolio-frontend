import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import type { ResizeEventDetail as ScreenSize } from "./types/resize";

export default class Camera {
  public static readonly FOV = 35;
  public static readonly NEAR = 0.1;
  public static readonly FAR = 100;
  public static readonly POSITION = Object.freeze(new THREE.Vector3(6, 4, 8));

  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private size: ScreenSize;

  public constructor(canvas: HTMLCanvasElement, scene: THREE.Scene, size: ScreenSize) {
    this.size = { ...size };

    this.camera = new THREE.PerspectiveCamera(Camera.FOV, this.aspect, Camera.NEAR, Camera.FAR);
    this.camera.position.set(Camera.POSITION.x, Camera.POSITION.y, Camera.POSITION.z);

    scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
  }

  public resize(sizeData: ScreenSize) {
    this.size = { ...sizeData };

    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  public update() {
    this.controls.update();
  }

  public get instance() {
    return this.camera;
  }

  private get aspect() {
    return this.size.width / this.size.height;
  }
}
