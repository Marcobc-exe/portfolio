/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const Sphere = ({
  position,
  size,
  scale,
  texture = null,
  isSun,
  metalness = undefined,
  roughness = undefined,
  vertexShader = undefined,
  fragmentShader = undefined,
  blending = undefined,
  side = undefined,
  uniforms = undefined,
}) => {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!isSun) {
      ref.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={size} />
      {/* {uniforms === undefined && (
        <meshStandardMaterial 
          map={texture}
          // metalness={metalness}
          // roughness={roughness}
        />
      )} */}
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
