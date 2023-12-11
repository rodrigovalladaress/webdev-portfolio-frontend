import * as THREE from "three";

import vertexShader from "./shaders/wireframe-sea.vert.glsl";
import fragmentShader from "./shaders/wireframe-sea.frag.glsl";
import type { TimeTickEventDetail } from "./types/time";

export default class Sea {
  public static readonly ROTATION = Object.freeze(new THREE.Vector3(-1.02194, -0.15155, -2.35985));

  private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial, THREE.Object3DEventMap>;

  public constructor(scene: THREE.Scene) {
    const geometry = new THREE.PlaneGeometry(50, 25, 150, 150);
    const material = new THREE.RawShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      defines: {
        SMALL_WAVES_ITERATIONS: 11,
      },
      uniforms: {
        _time: { value: 0 },

        _bigWavesElevation: { value: 0.3 },
        _bigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        _bigWavesSpeed: { value: 0.75 },

        _smallWavesElevation: { value: 0.15 },
        _smallWavesFrequency: { value: 3 },
        _smallWavesSpeed: { value: 0.2 },
      },
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.rotation.x = Sea.ROTATION.x;
    this.mesh.rotation.y = Sea.ROTATION.y;
    this.mesh.rotation.z = Sea.ROTATION.z;

    scene.add(this.mesh);
  }

  public update(time: TimeTickEventDetail) {
    this.mesh.material.uniforms._time.value = time.elapsed;
  }
}
