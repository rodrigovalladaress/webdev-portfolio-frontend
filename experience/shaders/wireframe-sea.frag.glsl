precision mediump float;

/**
 * Data from Three.js
 */
uniform vec3 cameraPosition;

/**
 * Own data
 */
uniform float _colorOffset;
uniform float _colorMultiplier;
uniform vec3 _foamColor;
uniform float _foamIntensity;
uniform vec3 _depthColor;
uniform vec3 _surfaceColor;
uniform vec3 _fogColor;
uniform float _fogDistance;

varying vec2 _uv;
varying vec3 _position;
varying float _elevation;

void main() {
  float mixStrength = (_elevation + _colorOffset) * _colorMultiplier;
  vec3 surfaceFoamColor = mix(_surfaceColor, _foamColor, abs(_elevation * _foamIntensity));
  vec3 seaColor = mix(_depthColor, surfaceFoamColor, mixStrength);
  // Fog color
  seaColor = mix(seaColor, _fogColor, clamp(distance(_position, cameraPosition) - _fogDistance, 0.0, 1.0));

  gl_FragColor = vec4(seaColor, 1.0);
}