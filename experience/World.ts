import * as THREE from "three";

import Sea from "./Sea";

export default class World {
  private sea: Sea;

  public constructor(scene: THREE.Scene) {
    this.sea = new Sea(scene);
  }

  public update(deltaTime: number) {
    this.sea.update(deltaTime);
  }
}
