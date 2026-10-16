/* eslint-disable react/no-unknown-property */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useMediaQuery } from "@mui/material";
import { AdditiveBlending } from "three";
import shootingStarVertex from "../shaders/shootingStarVertex.glsl";
import shootingStarFragment from "../shaders/shootingStarFragment.glsl";

// Seconds between shooting stars; the first one comes sooner so visitors get to see it
const FIRST_DELAY = [3, 6];
const DELAY = [6, 14];
const DURATION = [0.9, 1.3]; // seconds on screen
const ANGLE = [20, 45]; // degrees below the horizon
const LENGTH = [1.5, 2.5]; // world units (~140-240 px)
const THICKNESS = 0.03;
const Z = -550; // in front of the stars, behind the sun and the earth

const randomBetween = ([min, max]) => min + Math.random() * (max - min);

/* One shooting star at a time, crossing the upper part of the sky every few seconds */
const ShootingStars = () => {
  const meshRef = useRef();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const uniforms = useMemo(() => ({ uFade: { value: 0 } }), []);
  // Animation state lives in a ref, so the frames never re-render React
  const star = useRef({ active: false, wait: randomBetween(FIRST_DELAY) });

  useFrame(({ viewport }, frameDelta) => {
    const mesh = meshRef.current;
    const s = star.current;

    if (reduceMotion) {
      mesh.visible = false;
      return;
    }

    // Capped so a long-hidden tab doesn't jump the animation
    const delta = Math.min(frameDelta, 0.1);

    if (!s.active) {
      s.wait -= delta;
      if (s.wait > 0) {
        mesh.visible = false;
        return;
      }

      // Spawn: start on one side of the upper half and head down toward the other side
      const direction = Math.random() < 0.5 ? -1 : 1;
      const angle = (randomBetween(ANGLE) * Math.PI) / 180;
      s.dx = Math.cos(angle) * direction;
      s.dy = -Math.sin(angle);
      s.x = randomBetween(direction < 0 ? [0, 0.45] : [-0.45, 0]) * viewport.width;
      s.y = randomBetween([0.05, 0.45]) * viewport.height;
      s.speed = viewport.width * 0.6;
      s.length = Math.min(randomBetween(LENGTH), viewport.width * 0.35);
      s.duration = randomBetween(DURATION);
      s.elapsed = 0;
      s.active = true;
    }

    s.elapsed += delta;
    const progress = s.elapsed / s.duration;

    if (progress >= 1) {
      s.active = false;
      s.wait = randomBetween(DELAY);
      mesh.visible = false;
      return;
    }

    // The plane points along the motion, with its head at the current position
    const travelled = s.speed * s.elapsed;
    const headX = s.x + s.dx * travelled;
    const headY = s.y + s.dy * travelled;
    mesh.position.set(headX - (s.dx * s.length) / 2, headY - (s.dy * s.length) / 2, Z);
    mesh.rotation.z = Math.atan2(s.dy, s.dx);
    mesh.scale.set(s.length, THICKNESS, 1);
    uniforms.uFade.value = Math.sin(Math.PI * progress);
    mesh.visible = true;
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={shootingStarVertex}
        fragmentShader={shootingStarFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

export default ShootingStars;
