uniform float uPulse;   // engine throb, ~0.7-1.0
uniform float uOpacity; // the ship's page fade

varying vec2 vUv;

void main() {
  float d = length(vUv - 0.5) * 2.0; // 0 at the center, 1 at the edge of the plane

  float core = exp(-d * d * 18.0);
  float halo = exp(-d * 3.5) * 0.35;
  // Fade out before the plane's square edge
  float alpha = (core + halo) * (1.0 - smoothstep(0.8, 1.0, d)) * uPulse * uOpacity;

  vec3 color = mix(vec3(0.62, 0.83, 1.0), vec3(1.0), core);
  gl_FragColor = vec4(color, alpha);

  #include <colorspace_fragment>
}
