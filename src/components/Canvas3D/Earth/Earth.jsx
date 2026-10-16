/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useMediaQuery } from "@mui/material";
import { AdditiveBlending, BackSide, RepeatWrapping, TextureLoader, Vector3 } from "three";
import earthVertex from "../shaders/earthVertex.glsl";
import earthFragment from "../shaders/earthFragment.glsl";
import cloudsFragment from "../shaders/cloudsFragment.glsl";
import atmosphereVertex from "../shaders/atmosphereVertex.glsl";
import atmosphereFragment from "../shaders/atmosphereFragment.glsl";

// Desktop look: radius 4, centered at x = -8, y = -2
const EARTH_RADIUS = 4;
const SPHERE_ARGS = [1, 64, 64];
const CLOUDS_RADIUS = EARTH_RADIUS * 1.01;
// The old atmosphere shader divided position by w = 0.9, which scaled the 4.2 shell by 1/0.9
const ATMOSPHERE_RADIUS = 4.2 / 0.9;

// Light from the upper right (the sun's side) and a bit from behind the planet. Only the globe's
// right side is on screen, so this puts the day/night line through the visible part
const SUN_DIR = new Vector3(1.0, 0.3, -0.5).normalize();

// rad/s; the earth matches the old 0.0005 per frame at 60 Hz, the clouds drift a bit faster
const EARTH_SPEED = 0.03;
const CLOUDS_SPEED = 0.036;

/* Lit day side, city lights at night, drifting clouds and a sunlit atmospheric rim */
const Earth = () => {
  const [dayMap, lightsMap, cloudsMap] = useLoader(TextureLoader, [
    "./2k_earth_daymap.jpg", // portfolio path
    "./earth_lights_2048.webp",
    "./earth_clouds_1024.webp",
  ]);
  // World units visible on screen (canvas px / camera zoom)
  const viewport = useThree((state) => state.viewport);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const surfaceRef = useRef();
  const cloudsRef = useRef();

  // The cloud shadow is sampled with a u offset, so the texture has to wrap around
  useEffect(() => {
    cloudsMap.wrapS = RepeatWrapping;
    cloudsMap.needsUpdate = true;
  }, [cloudsMap]);

  const sunDir = useMemo(() => ({ value: SUN_DIR }), []);
  const cloudOffset = useMemo(() => ({ value: 0 }), []);
  const surfaceUniforms = useMemo(
    () => ({
      uDayMap: { value: dayMap },
      uLightsMap: { value: lightsMap },
      uCloudsMap: { value: cloudsMap },
      uSunDir: sunDir,
      uCloudOffset: cloudOffset,
    }),
    [dayMap, lightsMap, cloudsMap, sunDir, cloudOffset]
  );
  const cloudsUniforms = useMemo(
    () => ({ uCloudsMap: { value: cloudsMap }, uSunDir: sunDir }),
    [cloudsMap, sunDir]
  );
  const atmosphereUniforms = useMemo(
    () => ({
      uSunDir: sunDir,
      // -normal.z of the shell's back face right at the planet's edge
      uRimDepth: { value: Math.sqrt(1 - (EARTH_RADIUS / ATMOSPHERE_RADIUS) ** 2) },
    }),
    [sunDir]
  );

  // delta keeps the speed the same on any refresh rate; reduced motion stops the rotation
  useFrame((_, delta) => {
    if (reduceMotion) return;

    surfaceRef.current.rotation.y += EARTH_SPEED * delta;
    cloudsRef.current.rotation.y += CLOUDS_SPEED * delta;
    // A rotation of θ shifts the texture by θ / 2π in u
    cloudOffset.value =
      (surfaceRef.current.rotation.y - cloudsRef.current.rotation.y) / (2 * Math.PI);
  });

  // Wide screens keep the desktop look; narrower ones pin the globe to the
  // left edge, and phones / short screens shrink it so it still shows
  const radius = Math.min(EARTH_RADIUS, viewport.width * 0.5, viewport.height * 0.75);
  const ratio = radius / EARTH_RADIUS;
  const x = Math.max(-8, -viewport.width / 2 - 0.8 * ratio);

  return (
    <group position={[x, -2 * ratio, -5]} scale={ratio}>
      <mesh ref={surfaceRef} scale={EARTH_RADIUS}>
        <sphereGeometry args={SPHERE_ARGS} />
        <shaderMaterial
          vertexShader={earthVertex}
          fragmentShader={earthFragment}
          uniforms={surfaceUniforms}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={CLOUDS_RADIUS}>
        <sphereGeometry args={SPHERE_ARGS} />
        <shaderMaterial
          vertexShader={earthVertex}
          fragmentShader={cloudsFragment}
          uniforms={cloudsUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh scale={ATMOSPHERE_RADIUS}>
        <sphereGeometry args={SPHERE_ARGS} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmosphereUniforms}
          blending={AdditiveBlending}
          side={BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default Earth;
