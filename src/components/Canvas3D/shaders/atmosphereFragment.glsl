uniform vec3 uSunDir;
uniform float uRimDepth; // -normal.z where the shell meets the planet's edge (set in Earth.jsx)

varying vec3 vNormal;

void main() {
  // Back faces of the shell: normal.z goes from 0 at the outer edge to -uRimDepth at the planet,
  // so t is 1 against the planet and fades to 0 outward
  float t = clamp(-vNormal.z / uRimDepth, 0.0, 1.0);
  float intensity = pow(t, 6.0); // thin, bright rim

  // Bright on the sunlit side, faint on the night side
  float facing = dot(normalize(vec3(vNormal.xy, 0.0)), uSunDir);
  float lit = smoothstep(-0.5, 0.6, facing);

  vec3 color = mix(vec3(0.3, 0.6, 1.0), vec3(0.6, 0.8, 1.0), t * lit);
  color *= mix(0.1, 1.0, lit);

  gl_FragColor = vec4(color, intensity);
}
