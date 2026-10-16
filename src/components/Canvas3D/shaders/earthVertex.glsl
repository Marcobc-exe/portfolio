varying vec2 vUv;
varying vec3 vNormal;

void main () {
  vUv = uv;
  // View space: the orthographic camera never rotates, so uSunDir is a fixed direction here
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
