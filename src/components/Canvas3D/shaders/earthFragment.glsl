uniform sampler2D uDayMap;
uniform sampler2D uLightsMap;
uniform sampler2D uCloudsMap;
uniform vec3 uSunDir;
uniform float uCloudOffset; // where the (faster) cloud layer sits over this point, in texture u

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 n = normalize(vNormal);
  float NdotL = dot(n, uSunDir);
  float lit = smoothstep(-0.1, 0.25, NdotL);

  // Day side, darkened a little under the clouds
  vec3 day = texture2D(uDayMap, vUv).rgb;
  float cloudShadow = texture2D(uCloudsMap, vUv + vec2(uCloudOffset, 0.0)).r;
  day *= 1.0 - cloudShadow * 0.35 * lit;
  day *= mix(0.03, 1.05, lit);

  // Night side: the dim blue base map plus warm, boosted city lights
  vec3 night = texture2D(uLightsMap, vUv).rgb;
  float cityLum = dot(night, vec3(0.299, 0.587, 0.114));
  vec3 lights = night * 0.5 + vec3(1.0, 0.8, 0.55) * smoothstep(0.25, 0.8, cityLum) * 0.9;
  float nightMix = 1.0 - smoothstep(-0.25, 0.1, NdotL);

  vec3 color = day + lights * nightMix;

  // Warm band along the terminator (day/night line)
  color += vec3(1.0, 0.45, 0.2) * exp(-pow(NdotL * 8.0, 2.0)) * 0.12;

  // Atmospheric rim on the surface, only on the sunlit side
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
  color += vec3(0.3, 0.6, 1.0) * fresnel * smoothstep(-0.3, 0.6, NdotL);

  gl_FragColor = vec4(color, 1.0);
}
