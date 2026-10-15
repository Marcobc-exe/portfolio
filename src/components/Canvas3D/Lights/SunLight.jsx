/* eslint-disable react/no-unknown-property */
import { useRef } from "react";

const SunLight = () => {
  const pointLightRef = useRef();

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
