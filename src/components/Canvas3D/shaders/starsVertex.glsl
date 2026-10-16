uniform float uTime;
uniform float uPixelRatio;

attribute float aSize; // star diameter in CSS px
attribute vec3 aColor;
attribute float aPhase;
attribute float aSpeed;

varying vec3 vColor;
varying float vTwinkle;
varying float vSize;

void main () {
  // Each star twinkles on its own; small ones flicker more than the big ones
  float depth = mix(0.35, 0.12, smoothstep(1.0, 4.5, aSize));
  vTwinkle = 1.0 - depth + depth * sin(uTime * aSpeed + aPhase);
  vColor = aColor;
  vSize = aSize;

  // The sprite is 4x the star, leaving room for the glow and the cross spikes
  gl_PointSize = aSize * 4.0 * uPixelRatio;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
