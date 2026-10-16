/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useMediaQuery } from "@mui/material";
import { AdditiveBlending, Color } from "three";
import starsVertex from "../shaders/starsVertex.glsl";
import starsFragment from "../shaders/starsFragment.glsl";

const COUNT = 2500;
// World units; with the orthographic zoom of 95 this covers screens up to ~4200 x 2500 px,
// so wider screens simply show more of the same field
const FIELD_WIDTH = 44;
const FIELD_HEIGHT = 26;
const FIELD_Z = -600; // behind the sun and the earth
const SEED = 7; // same sky on every visit

// Star colors by temperature, with how common each one is
const PALETTE = [
  ["#aabfff", 0.15], // blue-white
  ["#ffffff", 0.45], // white
  ["#fff4e8", 0.25], // warm white
  ["#ffd9a8", 0.1], // yellow
  ["#ffb380", 0.05], // orange
];

// Small seeded PRNG (mulberry32), so the field doesn't change between reloads
const createRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const pickColor = (random) => {
  let roll = random();
  for (const [hex, weight] of PALETTE) {
    if (roll < weight) return new Color(hex);
    roll -= weight;
  }
  return new Color(PALETTE[0][0]);
};

const createStars = () => {
  const random = createRandom(SEED);
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  const speeds = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (random() - 0.5) * FIELD_WIDTH;
    positions[i * 3 + 1] = (random() - 0.5) * FIELD_HEIGHT;
    positions[i * 3 + 2] = FIELD_Z;
    pickColor(random).toArray(colors, i * 3);
    // Mostly 1-1.5 px, a few bright ones up to ~4.5 px
    sizes[i] = 1.0 + 3.5 * random() ** 6;
    phases[i] = random() * Math.PI * 2;
    speeds[i] = 0.5 + random() * 1.5;
  }

  return { positions, colors, sizes, phases, speeds };
};

/* Star field: temperature colors, mostly small stars, each one twinkling on its own */
const Starfield = () => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const stars = useMemo(createStars, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }),
    []
  );

  // dpr keeps the sizes in CSS px on retina screens; reduced motion stops the twinkling
  useFrame((state, delta) => {
    uniforms.uPixelRatio.value = state.viewport.dpr;
    if (!reduceMotion) uniforms.uTime.value += delta;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[stars.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[stars.sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[stars.phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[stars.speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starsVertex}
        fragmentShader={starsFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
};

export default Starfield;
