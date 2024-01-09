/* eslint-disable react/no-unknown-property */
import { Canvas, useLoader } from "@react-three/fiber";
import "./index.css";
import Sphere from "./Sphere/Sphere";
import { TextureLoader, AdditiveBlending, BackSide } from "three";
import SunLight from "./Lights/SunLight";
import { OrbitControls, Stars } from "@react-three/drei";
import SecondLight from "./Lights/SecondLight";
import { useSelector } from "react-redux";
import earthVShaders from './shaders/vertex.glsl'
import earthFShaders from './shaders/fragment.glsl'
import earthAtmosphereVShaders from './shaders/atmosphereVertex.glsl'
import earthAtmosphereFShaders from './shaders/atmosphereFragment.glsl'
import sunVertex from './shaders/sunVertex.glsl'
import sunFragment from './shaders/sunFragment.glsl'
const Canvas3D = () => {
  // const { x, y, z } = useSelector((state) => state.camera);
  // const planet0Texture = useLoader(TextureLoader, "./src/assets/planet0.jpeg");
  const earthTexture = useLoader(TextureLoader, "./src/assets/2k_earth_daymap.jpg")
  // const earthTexture = useLoader(TextureLoader, "./2k_earth_daymap.jpg") // portfolio path

  return (
    <Canvas
      className="canvas"
      shadows={true}
      // linear={true}
      orthographic
      camera={{
        near: 3,
        far: 1200,
        zoom: 95,
        // left: 120,
        // top: 120,
        // right: 120,
        // bottom: 120,
        // fov: 80,
        // aspect: 1.77, // 16:9 (1080p) = 1.77
        // position: [x, y, z],
        // position: [0, 0, 20],
      }}
    >
      {/* <OrbitControls /> */}
      <Stars count={10000} fade={true} radius={2} />
      {/* <SunLight /> */}
      {/* <SecondLight /> */}
      <Sphere
        position={[0, 0, -230]}
        // position={[0, 0, -30]}
        args={[5, 60, 60]}
        scale={0.1}
        // scale={3}
        isSun={true}
        vertexShader={sunVertex}
        fragmentShader={sunFragment}
        blending={AdditiveBlending}
        side={BackSide}
      />
      <group position={[-8, -2, -5]}>
        <Sphere
          args={{
            radius: 5,
            widthSegments: 60,
            heightSegments: 60,
          }}
          scale={4}
          // texture={planet0Texture}
          // texture={earthTexture}
          isSun={false}
          uniforms={{
            globeTexture: {
              value: earthTexture
              // value: planet0Texture
            }
          }}
          vertexShader={earthVShaders}
          fragmentShader={earthFShaders}
        />

        <Sphere
          args={{
            radius: 5,
            widthSegments: 60,
            heightSegments: 60,
          }}
          scale={[4.2, 4.2, 4.2]}
          isSun={true}
          vertexShader={earthAtmosphereVShaders}
          fragmentShader={earthAtmosphereFShaders}
          blending={AdditiveBlending}
          side={BackSide}
        />
      </group>
    </Canvas>
  );
};

export default Canvas3D;
