uniform sampler2D uCloudsMap;
uniform vec3 uSunDir;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 n = normalize(vNormal);
  float NdotL = dot(n, uSunDir);
  float lit = smoothstep(-0.1, 0.25, NdotL);

  float density = texture2D(uCloudsMap, vUv).r;

  // White in daylight, almost gone at night, warm along the terminator
  vec3 color = mix(vec3(0.05), vec3(1.0), lit);
  color += vec3(1.0, 0.5, 0.25) * exp(-pow(NdotL * 8.0, 2.0)) * 0.2;

  gl_FragColor = vec4(color, density * mix(0.08, 0.75, lit));
}
