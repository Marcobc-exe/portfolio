/* eslint-disable react/no-unknown-property */
import { Suspense } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import Sphere from "./Sphere/Sphere";
import Sun from "./Sun/Sun";
import { TextureLoader, AdditiveBlending, BackSide } from "three";
import { Stars } from "@react-three/drei";
import earthVShaders from './shaders/vertex.glsl'
import earthFShaders from './shaders/fragment.glsl'
import earthAtmosphereVShaders from './shaders/atmosphereVertex.glsl'
import earthAtmosphereFShaders from './shaders/atmosphereFragment.glsl'

// radius 1 keeps the original on-screen size (three.js default radius)
const SPHERE_ARGS = [1, 60, 60];

// Desktop look: radius 4, centered at x = -8, y = -2
const EARTH_RADIUS = 4;

/* Loads its texture inside <Canvas>, so only the globe waits for it */
const Earth = () => {
  const earthTexture = useLoader(TextureLoader, "./2k_earth_daymap.jpg") // portfolio path
  // World units visible on screen (canvas px / camera zoom)
  const viewport = useThree((state) => state.viewport);

  // Wide screens keep the desktop look; narrower ones pin the globe to the
  // left edge, and phones / short screens shrink it so it still shows
  const radius = Math.min(EARTH_RADIUS, viewport.width * 0.5, viewport.height * 0.75);
  const ratio = radius / EARTH_RADIUS;
  const x = Math.max(-8, -viewport.width / 2 - 0.8 * ratio);

  return (
    <group position={[x, -2 * ratio, -5]} scale={ratio}>
      <Sphere
        args={SPHERE_ARGS}
        scale={4}
        isSun={false}
        uniforms={{
          globeTexture: {
            value: earthTexture
          }
        }}
        vertexShader={earthVShaders}
        fragmentShader={earthFShaders}
      />

      <Sphere
        args={SPHERE_ARGS}
        scale={[4.2, 4.2, 4.2]}
        isSun={true}
        vertexShader={earthAtmosphereVShaders}
        fragmentShader={earthAtmosphereFShaders}
        blending={AdditiveBlending}
        side={BackSide}
      />
    </group>
  );
};

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
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </Canvas>
  );
};

export default Canvas3D;
