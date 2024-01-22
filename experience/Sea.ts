import * as THREE from "three";

import vertexShader from "./shaders/wireframe-sea.vert.glsl";
import fragmentShader from "./shaders/wireframe-sea.frag.glsl";
import type { TimeTickEventDetail } from "./types/time";
import Debug from "./Debug";

export default class Sea {
  // public static readonly POSITION = Object.freeze(new THREE.Vector3(0, -0.209, 0));
  public static readonly POSITION = Object.freeze(new THREE.Vector3(0, -0.471, 0));
  // public static readonly ROTATION = Object.freeze(new THREE.Vector3(-1.275, -0.123, -2.35985));
  public static readonly ROTATION = Object.freeze(new THREE.Vector3(-1.192, -0.123, -3.125));

  private mesh: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.ShaderMaterial,
    THREE.Object3DEventMap
  >;

  private debugObject = {
    fog: {
      color: 0x000000,
    },
    foam: {
      color: 0x82ff82,
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

    _fogColor: { value: new THREE.Color(this.debugObject.fog.color) },
    // _fogDistance: { value: 8.5 },
    // _fogDistance: { value: 14.136 },
    _fogDistance: { value: 9 },

    _wireframeThickness: { value: 0.02 },
  };

  public constructor(scene: THREE.Scene) {
    // The mesh needs to be non indexed...
    const geometry = new THREE.PlaneGeometry(50, 25, 150, 150).toNonIndexed();
    // ... so we can add the barycentric coordinates
    this.addBarycentricCoordinates(geometry, true);

    const material = new THREE.ShaderMaterial({
      extensions: {
        // #extension GL_OES_standard_derivatives : enable
        derivatives: true,
      },
      // transparent: true,
      // depthWrite: false,
      // depthTest: false,
      side: THREE.DoubleSide,
      defines: {
        SMALL_WAVES_ITERATIONS: 11,
      },
      uniforms: { ...this.uniforms },
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.x = Sea.POSITION.x;
    this.mesh.position.y = Sea.POSITION.y;
    this.mesh.position.z = Sea.POSITION.z;

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

  /*
   * Adds an attribute called "barycentric" to the geometry
   * Edited from https://github.com/mattdesl/webgl-wireframes/blob/gh-pages/lib/geom.js
   */
  private addBarycentricCoordinates(geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>, removeEdge = false) {
    const attrib = geometry.getIndex() || geometry.getAttribute("position");
    const count = attrib.count / 3;
    const barycentric: number[] = [];

    // for each triangle in the geometry, add the barycentric coordinates
    for (let i = 0; i < count; i++) {
      const even = i % 2 === 0;
      const Q = removeEdge ? 1 : 0;
      if (even) {
        barycentric.push(0, 0, 1, 0, 1, 0, 1, 0, Q);
      } else {
        barycentric.push(0, 1, 0, 0, 0, 1, 1, 0, Q);
      }
    }

    // add the attribute to the geometry
    const arrayAttribute = new Float32Array(barycentric);
    // https://stackoverflow.com/questions/67245991/three-bufferattribute-setarray-has-been-removed-use-buffergeometry-setattrib
    geometry.setAttribute("barycentric", new THREE.BufferAttribute(arrayAttribute, 3));
  }

  private addDebugOptions() {
    const gui = Debug.guiInstance;
    if (!gui) {
      return;
    }

    const uniforms = this.mesh.material.uniforms as typeof this.uniforms;

    const folder = gui.addFolder("Sea");
    folder.add(uniforms._colorOffset, "value").name("Color offset").min(0).max(1).step(0.001);
    folder.add(uniforms._colorMultiplier, "value").name("Color multiplier").min(0).max(10).step(0.001);

    const position = folder.addFolder("Position");
    position.add(this.mesh.position, "x").min(-10).max(10).step(0.001);
    position.add(this.mesh.position, "y").min(-10).max(10).step(0.001);
    position.add(this.mesh.position, "z").min(-10).max(10).step(0.001);

    const rotation = folder.addFolder("Rotation");
    rotation.add(this.mesh.rotation, "x").min(-Math.PI).max(0).step(0.001);
    rotation.add(this.mesh.rotation, "y").min(-Math.PI).max(0).step(0.001);
    rotation.add(this.mesh.rotation, "z").min(-Math.PI).max(0).step(0.001);

    const foam = folder.addFolder("Foam");
    foam.addColor(this.debugObject.foam, "color").onChange(() => {
      this.updateUniform("_foamColor", this.debugObject.foam.color);
    });
    foam.add(uniforms._foamIntensity, "value").name("Intensity").min(0).max(20).step(0.001);

    const depth = folder.addFolder("Depth");
    depth.addColor(this.debugObject.depth, "color").onChange(() => {
      this.updateUniform("_depthColor", this.debugObject.depth.color);
    });

    const surface = folder.addFolder("Surface");
    surface.addColor(this.debugObject.surface, "color").onChange(() => {
      this.updateUniform("_surfaceColor", this.debugObject.surface.color);
    });

    const bigWaves = folder.addFolder("Big waves");
    bigWaves.add(uniforms._bigWavesElevation, "value").name("Elevation").min(0).max(3).step(0.001);
    bigWaves.add(uniforms._bigWavesFrequency.value, "x").name("Frequency x").min(0).max(10).step(0.001);
    bigWaves.add(uniforms._bigWavesFrequency.value, "y").name("Frequency y").min(0).max(10).step(0.001);
    bigWaves.add(uniforms._bigWavesSpeed, "value").name("Speed").min(0).max(10).step(0.001);

    const smallWaves = folder.addFolder("Small waves");
    smallWaves.add(uniforms._smallWavesElevation, "value").name("Elevation").min(0).max(3).step(0.001);
    smallWaves.add(uniforms._smallWavesFrequency, "value").name("Frequency").min(0).max(6).step(0.001);
    smallWaves.add(uniforms._smallWavesSpeed, "value").name("Speed").min(0).max(3).step(0.001);

    const fog = folder.addFolder("Fog");
    fog.addColor(this.debugObject.fog, "color").onChange(() => {
      this.updateUniform("_fogColor", this.debugObject.fog.color);
    });
    fog.add(uniforms._fogDistance, "value").name("Distance").min(0).max(200).step(0.001);

    const wireframe = folder.addFolder("Wireframe");
    wireframe.add(uniforms._wireframeThickness, "value").name("Thickness").min(0).max(1).step(0.001);
  }

  private updateUniform(name: keyof typeof this.uniforms, color: any) {
    this.mesh.material.uniforms[name].value.set(color);
  }
}
