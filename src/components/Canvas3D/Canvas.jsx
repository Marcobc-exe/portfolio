import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Earth from "./Earth/Earth";
import Sun from "./Sun/Sun";

const Canvas3D = () => {
  return (
    <Canvas
      className="canvas"
      shadows={true}
      orthographic
      camera={{
        near: 3,
        far: 1200,
        zoom: 95,
      }}
    >
      <Stars count={10000} fade={true} radius={2} />
      <Sun />
      {/* Earth loads its textures inside <Canvas>, so only the globe waits for them */}
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </Canvas>
  );
};

export default Canvas3D;
