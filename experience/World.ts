import * as THREE from "three";

import Sea from "./Sea";
import type { TimeTickEventDetail } from "./types/time";

export default class World {
  private sea: Sea;

  public constructor(scene: THREE.Scene) {
    this.sea = new Sea(scene);
  }

  public update(time: TimeTickEventDetail) {
    this.sea.update(time);
  }

  public animateHome() {
    this.sea.animateHome();
  }

  public animateProjects() {
    this.sea.animateProjects();
  }

  public animateContact() {
    this.sea.animateContact();
  }
}
