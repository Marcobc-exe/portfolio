/* eslint-disable react/no-unknown-property */
import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import "./index.css";
import Sphere from "./Sphere/Sphere";
import { TextureLoader, AdditiveBlending, BackSide } from "three";
import { Stars } from "@react-three/drei";
import earthVShaders from './shaders/vertex.glsl'
import earthFShaders from './shaders/fragment.glsl'
import earthAtmosphereVShaders from './shaders/atmosphereVertex.glsl'
import earthAtmosphereFShaders from './shaders/atmosphereFragment.glsl'
import sunVertex from './shaders/sunVertex.glsl'
import sunFragment from './shaders/sunFragment.glsl'

// radius 1 keeps the original on-screen size (three.js default radius)
const SPHERE_ARGS = [1, 60, 60];

/* Loads its texture inside <Canvas>, so only the globe waits for it */
const Earth = () => {
  const earthTexture = useLoader(TextureLoader, "./2k_earth_daymap.jpg") // portfolio path

  return (
    <group position={[-8, -2, -5]}>
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
      <Sphere
        position={[0, 0, -230]}
        args={SPHERE_ARGS}
        scale={0.1}
        isSun={true}
        vertexShader={sunVertex}
        fragmentShader={sunFragment}
        blending={AdditiveBlending}
        side={BackSide}
      />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </Canvas>
  );
};

export default Canvas3D;
