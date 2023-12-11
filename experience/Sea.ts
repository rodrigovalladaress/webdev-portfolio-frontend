import * as THREE from "three";

export default class Sea {
  public static readonly ROTATION = Object.freeze(new THREE.Vector3(-1.02194, -0.15155, -2.35985));

  private mesh: THREE.Mesh;

  public constructor(scene: THREE.Scene) {
    const geometry = new THREE.PlaneGeometry(50, 25, 150, 150);
    const material = new THREE.MeshBasicMaterial({ color: "red" });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.rotation.x = Sea.ROTATION.x;
    this.mesh.rotation.y = Sea.ROTATION.y;
    this.mesh.rotation.z = Sea.ROTATION.z;

    scene.add(this.mesh);
  }

  public update(_deltaTime: number) {
    // this.sea.update()
  }
}
