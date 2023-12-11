precision mediump float;

/**
 * Own data
 */
varying vec2 _uv;

void main() {
  gl_FragColor = vec4(_uv, 1.0, 1.0);
}