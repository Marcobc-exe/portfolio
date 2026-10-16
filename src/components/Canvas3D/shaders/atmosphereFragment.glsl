uniform vec3 uSunDir;
uniform float uRimDepth; // -dot(normal, viewDir) where the shell meets the planet's edge (set in Earth.jsx)

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  // Back faces of the shell: dot(n, viewDir) goes from 0 at the outer edge to -uRimDepth where
  // the line of sight grazes the planet, so t is 1 against the planet and fades to 0 outward
  float t = clamp(-dot(n, viewDir) / uRimDepth, 0.0, 1.0);
  float intensity = pow(t, 6.0); // thin, bright rim

  // Bright on the sunlit side, faint on the night side
  float lit = smoothstep(-0.5, 0.6, dot(n, uSunDir));

  vec3 color = mix(vec3(0.3, 0.6, 1.0), vec3(0.6, 0.8, 1.0), t * lit);
  color *= mix(0.1, 1.0, lit);

  gl_FragColor = vec4(color, intensity);
}
