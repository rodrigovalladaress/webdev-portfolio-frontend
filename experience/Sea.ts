import * as THREE from "three";

import vertexShader from "./shaders/wireframe-sea.vert.glsl";
import fragmentShader from "./shaders/wireframe-sea.frag.glsl";
import type { TimeTickEventDetail } from "./types/time";
import Debug from "./Debug";

export default class Sea {
  public static readonly ROTATION = Object.freeze(new THREE.Vector3(-1.02194, -0.15155, -2.35985));

  private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial, THREE.Object3DEventMap>;
  private debugObject = {
    fog: {
      color: 0x000000,
    },
    foam: {
      color: 0x82ff82,
      intensity: 6,
    },
    depth: {
      color: 0x01c28d,
    },
    surface: {
      color: 0x00ff00,
    },
  };

  private uniforms = {
    _time: { value: 0 },

    _bigWavesElevation: { value: 0.3 },
    _bigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    _bigWavesSpeed: { value: 0.75 },

    _smallWavesElevation: { value: 0.15 },
    _smallWavesFrequency: { value: 3 },
    _smallWavesSpeed: { value: 0.2 },

    _foamColor: { value: new THREE.Color(this.debugObject.foam.color) },
    _foamIntensity: { value: 6 },

    _depthColor: { value: new THREE.Color(this.debugObject.depth.color) },
    _surfaceColor: { value: new THREE.Color(this.debugObject.surface.color) },
    _colorOffset: { value: 0.08 },
    _colorMultiplier: { value: 5 },
  };

  public constructor(scene: THREE.Scene) {
    const geometry = new THREE.PlaneGeometry(50, 25, 150, 150);
    const material = new THREE.RawShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      defines: {
        SMALL_WAVES_ITERATIONS: 11,
      },
      uniforms: { ...this.uniforms },
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.rotation.x = Sea.ROTATION.x;
    this.mesh.rotation.y = Sea.ROTATION.y;
    this.mesh.rotation.z = Sea.ROTATION.z;

    scene.add(this.mesh);

    if (Debug.isActive) {
      this.addDebugOptions();
    }
  }

  public update(time: TimeTickEventDetail) {
    this.mesh.material.uniforms._time.value = time.elapsed;
  }

  private addDebugOptions() {
    const gui = Debug.guiInstance;
    if (!gui) {
      return;
    }

    const folder = gui.addFolder("Sea");

    folder.add(this.mesh.material.uniforms._colorOffset, "value").name("Color offset").min(0).max(1).step(0.001);
    folder
      .add(this.mesh.material.uniforms._colorMultiplier, "value")
      .name("Color multiplier")
      .min(0)
      .max(10)
      .step(0.001);

    const foam = folder.addFolder("Foam");
    foam.addColor(this.debugObject.foam, "color").onChange(() => {
      this.updateUniform("_foamColor", this.debugObject.foam.color);
    });
    foam.add(this.debugObject.foam, "intensity").min(0).max(20).step(0.001);

    const depth = folder.addFolder("Depth");
    depth.addColor(this.debugObject.depth, "color").onChange(() => {
      this.updateUniform("_depthColor", this.debugObject.depth.color);
    });

    const surface = folder.addFolder("Surface");
    surface.addColor(this.debugObject.surface, "color").onChange(() => {
      this.updateUniform("_surfaceColor", this.debugObject.surface.color);
    });
  }

  private updateUniform(name: keyof typeof this.uniforms, color: any) {
    this.mesh.material.uniforms[name].value.set(color);
  }
}
