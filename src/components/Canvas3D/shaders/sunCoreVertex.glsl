varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;

void main () {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mvPosition.xyz); // view space, toward the camera
  gl_Position = projectionMatrix * mvPosition;
}
