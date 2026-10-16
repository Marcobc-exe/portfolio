import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createShipMaterials } from "./materials";

/* The ship's materials plus a soft studio-like reflection map (generated, no image file) */
const useShipMaterials = () => {
  const gl = useThree((state) => state.gl);
  const envMap = useMemo(() => {
    const generator = new PMREMGenerator(gl);
    const texture = generator.fromScene(new RoomEnvironment(), 0.04).texture;
    generator.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => envMap.dispose(), [envMap]);

  return useMemo(() => createShipMaterials(envMap), [envMap]);
};

export default useShipMaterials;
