precision mediump float;

varying vec2 _uv;

void main() {
  gl_FragColor = vec4(_uv, 0.0, 1.0);
}