/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useMediaQuery } from "@mui/material";
import { AdditiveBlending, Color } from "three";
import coreVertex from "../shaders/sunCoreVertex.glsl";
import coreFragment from "../shaders/sunCoreFragment.glsl";
import coronaVertex from "../shaders/sunCoronaVertex.glsl";
import coronaFragment from "../shaders/sunCoronaFragment.glsl";

// Same breakpoint as the phone layout in the CSS (see Layout/styles/index.css)
const PHONE_QUERY = "(max-width: 600px), (max-height: 500px) and (orientation: landscape)";

const SUN_Z = -230;
const CORE_RADIUS = 0.1; // ~20px across with the camera's zoom of 95
const CORONA_SIZE = 1.26; // ~120px across
// Phones: tucked into the top-right corner, a bit smaller, to stay clear of the page content
const PHONE_MARGIN = 0.25;
const PHONE_SCALE = 0.8;

/* Plasma-textured core + glowing corona with slowly turning rays */
const Sun = () => {
  const viewport = useThree((state) => state.viewport);
  const isPhone = useMediaQuery(PHONE_QUERY);
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

  // delta keeps the speed the same on any refresh rate; reduced motion freezes it
  useFrame((_, delta) => {
    if (!reduceMotion) time.value += delta;
  });

  const position = isPhone
    ? [viewport.width / 2 - PHONE_MARGIN, viewport.height / 2 - PHONE_MARGIN, SUN_Z]
    : [0, 0, SUN_Z];

  return (
    <group position={position} scale={isPhone ? PHONE_SCALE : 1}>
      <mesh scale={CORE_RADIUS}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={coreUniforms}
        />
      </mesh>

      {/* Slightly behind the core, so the core is drawn on top */}
      <mesh position={[0, 0, -0.01]} scale={CORONA_SIZE}>
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
