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
// Sizes as a share of the visible area, so they look the same on any screen and camera pose
const LENGTH = [0.1, 0.17]; // of the visible width (desktop: ~140-240 px)
const MAX_LENGTH = 0.35; // of the visible width (keeps them short on phones)
const THICKNESS = 0.0035; // of the visible height (~3 px)
// Distance in front of the camera: beyond the earth (so it can pass behind it), before the sun
const DEPTH = 100;

const randomBetween = ([min, max]) => min + Math.random() * (max - min);

/* One shooting star at a time, crossing the upper part of the view every few seconds */
const ShootingStars = () => {
  const groupRef = useRef();
  const meshRef = useRef();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const uniforms = useMemo(() => ({ uFade: { value: 0 } }), []);
  // Animation state lives in a ref, so the frames never re-render React
  const star = useRef({ active: false, wait: randomBetween(FIRST_DELAY) });

  useFrame(({ camera }, frameDelta) => {
    const mesh = meshRef.current;
    const s = star.current;

    if (reduceMotion) {
      mesh.visible = false;
      return;
    }

    // The streak lives in camera space: it follows the camera, so it crosses the screen
    // the same way whatever the camera is looking at
    groupRef.current.position.copy(camera.position);
    groupRef.current.quaternion.copy(camera.quaternion);
    const height = 2 * DEPTH * Math.tan((camera.fov * Math.PI) / 360);
    const width = height * camera.aspect;

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
      s.x = randomBetween(direction < 0 ? [0, 0.45] : [-0.45, 0]);
      s.y = randomBetween([0.05, 0.45]);
      s.speed = 0.6; // visible widths per second
      s.length = Math.min(randomBetween(LENGTH), MAX_LENGTH);
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
    const travelled = s.speed * width * s.elapsed;
    const length = s.length * width;
    const headX = s.x * width + s.dx * travelled;
    const headY = s.y * height + s.dy * travelled;
    mesh.position.set(headX - (s.dx * length) / 2, headY - (s.dy * length) / 2, -DEPTH);
    mesh.rotation.z = Math.atan2(s.dy, s.dx);
    mesh.scale.set(length, THICKNESS * height, 1);
    uniforms.uFade.value = Math.sin(Math.PI * progress);
    mesh.visible = true;
  });

  return (
    <group ref={groupRef}>
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
    </group>
  );
};

export default ShootingStars;
