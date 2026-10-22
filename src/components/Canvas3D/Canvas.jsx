import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig/CameraRig";
import Earth from "./Earth/Earth";
import ShootingStars from "./ShootingStars/ShootingStars";
import Spaceship from "./Spaceship/Spaceship";
import Starfield from "./Starfield/Starfield";
import Sun from "./Sun/Sun";
import { BASE_FOV } from "./scene";

/* page: "home" | "work" | "projects" | "about" | "contact"; each one has its own camera pose (see scene.js) */
const Canvas3D = ({ page }) => {
  return (
    <Canvas className="canvas" camera={{ fov: BASE_FOV, near: 0.1, far: 2000 }}>
      {/* First, so the camera is in place before the sun and shooting stars copy its rotation */}
      <CameraRig page={page} />
      <Starfield />
      <ShootingStars />
      <Sun />
      {/* Earth loads its textures inside <Canvas>, so only the globe waits for them */}
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      {/* For now only on home: fades out on the other pages */}
      <Spaceship page={page} />
    </Canvas>
  );
};

export default Canvas3D;
