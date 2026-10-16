uniform float uFade; // 0 -> 1 -> 0 over the shooting star's life

varying vec2 vUv; // x: 0 at the tail, 1 at the head (the plane points along the motion)

void main() {
  float tail = pow(vUv.x, 2.5);
  float head = exp(-pow((0.97 - vUv.x) * 30.0, 2.0));
  float width = exp(-pow((vUv.y - 0.5) * 6.0, 2.0));
  float tip = 1.0 - smoothstep(0.97, 1.0, vUv.x);

  vec3 color = mix(vec3(0.7, 0.85, 1.0), vec3(1.0), head);
  float alpha = (tail * 0.8 + head) * width * tip * uFade;

  gl_FragColor = vec4(color, alpha);

  #include <colorspace_fragment>
}
