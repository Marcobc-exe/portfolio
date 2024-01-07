/* eslint-disable react/no-unknown-property */
import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { PointLightHelper } from "three";

const SunLight = () => {
  const pointLightRef = useRef();
  // useHelper(pointLightRef, PointLightHelper, 0.5, "white");

  return (
    <pointLight
      ref={pointLightRef}
      intensity={120}
      color={0xffffff}
      distance={1000}
      decay={12.3}
      position={[0, 0, -230]}
    />
  );
};

export default SunLight;
