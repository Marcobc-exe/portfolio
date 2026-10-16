varying vec2 vUv;
varying vec3 vNormal; // world space, like uSunDir
varying vec3 vWorldPosition;

void main () {
  vUv = uv;
  // The meshes are scaled uniformly, so the model matrix keeps normals perpendicular
  vNormal = normalize(mat3(modelMatrix) * normal);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
