precision mediump float;

/**
 * Own data
 */
uniform float _colorOffset;
uniform float _colorMultiplier;
uniform vec3 _foamColor;
uniform float _foamIntensity;
uniform vec3 _depthColor;
uniform vec3 _surfaceColor;

varying vec2 _uv;
varying float _elevation;

void main() {
  // gl_FragColor = vec4(_uv, 1.0, 1.0);

  float mixStrength = (_elevation + _colorOffset) * _colorMultiplier;
  // vec3 surfaceFoamColor = mix(vec3(1.0, 1.0, 0.0), foamColor, abs(_elevation * _foamIntensity));
  vec3 surfaceFoamColor = mix(_surfaceColor, _foamColor, abs(_elevation * _foamIntensity));
  vec3 seaColor = mix(_depthColor, surfaceFoamColor, mixStrength);

  gl_FragColor = vec4(seaColor, 1.0);
}