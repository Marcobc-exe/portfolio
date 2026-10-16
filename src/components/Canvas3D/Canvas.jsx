import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Earth from "./Earth/Earth";
import ShootingStars from "./ShootingStars/ShootingStars";
import Starfield from "./Starfield/Starfield";
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
      <Starfield />
      <ShootingStars />
      <Sun />
      {/* Earth loads its textures inside <Canvas>, so only the globe waits for them */}
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </Canvas>
  );
};

export default Canvas3D;
