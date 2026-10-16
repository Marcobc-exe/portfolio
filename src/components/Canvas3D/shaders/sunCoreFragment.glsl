uniform float uTime;
uniform vec3 uColorHot;
uniform vec3 uColorWarm;

varying vec3 vNormal;
varying vec3 vPosition;

// 3D value noise + fbm: the moving "plasma" on the surface
float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  float plasma = fbm(vPosition * 3.0 + vec3(0.0, 0.0, uTime * 0.15));
  vec3 color = mix(uColorWarm, uColorHot, smoothstep(0.3, 0.7, plasma));

  // Limb darkening: the edge of the disc is a bit dimmer than the center
  float facing = max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  color *= mix(0.75, 1.0, pow(facing, 0.4));

  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}
