precision mediump float;

/**
 * Data from Three.js
 */ 
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;

/**
 * Own data
 */ 
const float _smallWavesIterations = 4.0;

uniform float _time;
uniform vec2 _bigWavesFrequency;
uniform float _bigWavesSpeed;
uniform float _bigWavesElevation;
uniform float _smallWavesSpeed;
uniform float _smallWavesFrequency;
uniform float _smallWavesElevation;

varying vec2 _uv;

/**
 * glslify imports
 */
#pragma glslify: cnoise = require('./3d-noise.lib.glsl');
float cnoise(vec3 P);

/**
 * Main function
 */
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevationX = sin(modelPosition.x * _bigWavesFrequency.x + _time * _bigWavesSpeed);
  float elevationZ = sin(modelPosition.z * _bigWavesFrequency.y + _time * _bigWavesSpeed);

  float elevation = elevationX * elevationZ * _bigWavesElevation;
  for(float i = 1.0; i <= _smallWavesIterations; i++) {
    elevation += -abs(cnoise(vec3(modelPosition.xz * _smallWavesFrequency * i, _time * _smallWavesSpeed)) * _smallWavesElevation / i);
  }

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Varying
  _uv = uv;
}
