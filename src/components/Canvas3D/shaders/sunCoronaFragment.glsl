uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  vec2 p = vUv - 0.5;
  float d = length(p) * 2.0; // 0 at the center, 1 at the edge of the plane
  float angle = atan(p.y, p.x);
  float falloff = max(1.0 - d, 0.0);

  // Soft glow around the core
  float glow = pow(falloff, 2.5);

  // Slowly turning rays; whole-number frequencies avoid a seam where atan wraps around
  float rays = pow(abs(sin(angle * 6.0 + uTime * 0.2)), 8.0);
  rays *= 0.6 + 0.4 * sin(angle * 11.0 - uTime * 0.35);
  rays *= falloff * falloff;

  // Fade to nothing before the plane's edges so its square shape never shows
  float alpha = (glow + rays * 0.35) * (1.0 - smoothstep(0.6, 1.0, d));
  vec3 color = mix(uColor, vec3(1.0, 0.95, 0.85), glow);

  gl_FragColor = vec4(color, alpha);

  #include <colorspace_fragment>
}
