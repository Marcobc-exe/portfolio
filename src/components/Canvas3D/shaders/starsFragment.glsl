varying vec3 vColor;
varying float vTwinkle;
varying float vSize;

void main() {
  vec2 p = gl_PointCoord - 0.5; // -0.5..0.5 across the sprite; the star itself is the middle quarter

  float core = exp(-dot(p, p) / (2.0 * 0.09 * 0.09));
  float glow = 0.15 * exp(-length(p) * 12.0);

  // Thin cross spikes, only on the brightest stars
  float spikes = exp(-abs(p.y) * 80.0) * exp(-abs(p.x) * 6.0)
               + exp(-abs(p.x) * 80.0) * exp(-abs(p.y) * 6.0);
  spikes *= 0.35 * smoothstep(3.0, 4.5, vSize);

  // Fade out before the sprite's square edge
  float edge = 1.0 - smoothstep(0.4, 0.5, max(abs(p.x), abs(p.y)));

  gl_FragColor = vec4(vColor * vTwinkle, (core + glow + spikes) * edge);

  #include <colorspace_fragment>
}
