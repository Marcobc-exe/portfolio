/* eslint-disable react/no-unknown-property */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useMediaQuery } from "@mui/material";
import { AdditiveBlending, Color } from "three";
import { SUN_POSITION } from "../scene";
import coreVertex from "../shaders/sunCoreVertex.glsl";
import coreFragment from "../shaders/sunCoreFragment.glsl";
import coronaVertex from "../shaders/sunCoronaVertex.glsl";
import coronaFragment from "../shaders/sunCoronaFragment.glsl";

// World units at ~200 units from the home camera: ~20 px core and ~120 px corona on a 1440 x 900 screen
const CORE_RADIUS = 1.45;
const CORONA_SIZE = 18.3;

/* Plasma-textured core + glowing corona with slowly turning rays */
const Sun = () => {
  const coronaRef = useRef();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // One time uniform shared by both materials
  const time = useMemo(() => ({ value: 0 }), []);
  const coreUniforms = useMemo(
    () => ({
      uTime: time,
      uColorHot: { value: new Color("#fff4d6") },
      uColorWarm: { value: new Color("#ffcc66") },
    }),
    [time]
  );
  const coronaUniforms = useMemo(
    () => ({
      uTime: time,
      uColor: { value: new Color("#ff9a3c") },
    }),
    [time]
  );

  useFrame(({ camera }, delta) => {
    // The corona is a flat plane, so it always turns to face the camera
    coronaRef.current.quaternion.copy(camera.quaternion);
    // delta keeps the speed the same on any refresh rate; reduced motion freezes it
    if (!reduceMotion) time.value += delta;
  });

  return (
    <group position={SUN_POSITION}>
      <mesh scale={CORE_RADIUS}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={coreUniforms}
        />
      </mesh>

      {/* depthWrite off on the corona, so the core (drawn as opaque) always shows through it */}
      <mesh ref={coronaRef} scale={CORONA_SIZE}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={coronaVertex}
          fragmentShader={coronaFragment}
          uniforms={coronaUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default Sun;
