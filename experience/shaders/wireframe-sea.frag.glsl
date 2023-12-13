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
uniform float _wireframeThickness;

varying vec2 _uv;
varying vec3 _position;
varying float _elevation;
varying vec3 _barycentric;

float aastep(float threshold, float dist) {
  // https://computergraphics.stackexchange.com/questions/61/what-is-fwidth-and-how-does-it-work
  float afwidth = fwidth(dist) * 0.5;

  return smoothstep(threshold - afwidth, threshold + afwidth, dist);
}

void main() {
  /*
   * Sea color
   */
  float mixStrength = (_elevation + _colorOffset) * _colorMultiplier;
  vec3 surfaceFoamColor = mix(_surfaceColor, _foamColor, abs(_elevation * _foamIntensity));
  vec3 seaColor = mix(_depthColor, surfaceFoamColor, mixStrength);
  // Fog color
  seaColor = mix(seaColor, _fogColor, clamp(distance(_position, cameraPosition) - _fogDistance, 0.0, 1.0));

  /*
   * Wireframe
   *
   * Edited from:
   * https://github.com/mattdesl/webgl-wireframes/blob/gh-pages/lib/wire.frag
   */
  // Signed distance for the wireframe edge
  float d = min(min(_barycentric.x, _barycentric.y), _barycentric.z);
  // compute the anti-aliased stroke edge
  float edge = 1.0 - aastep(_wireframeThickness, d);
  // TODO No antialias version for mobile?
  // float edge = 1.0 - step(_wireframeThickness, d);

  // Combine the sea color with the edge
  vec4 outColor = vec4(seaColor, edge);

  gl_FragColor = vec4(outColor);
}