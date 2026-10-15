/* eslint-disable react/no-unknown-property */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const Sphere = ({
  position,
  args,
  scale,
  isSun,
  vertexShader = undefined,
  fragmentShader = undefined,
  blending = undefined,
  side = undefined,
  uniforms = undefined,
}) => {
  const ref = useRef();

  useFrame(() => {
    if (!isSun) {
      ref.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={args} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        blending={blending}
        side={side}
      />
    </mesh>
  );
};

export default Sphere;
