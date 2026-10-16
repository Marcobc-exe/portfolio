/* eslint-disable react/no-unknown-property */
import { useFrame, useThree } from "@react-three/fiber";
import { useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { Euler, PMREMGenerator, Quaternion, Vector3 } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SUN_DIR, getShipTransform } from "../scene";
import { createShipMaterials } from "./materials";
import SpaceshipModel from "./SpaceshipModel";

// Turn from the home camera's view: nose away, to the right and a bit down, so we see the
// engines, the top and the left side (a rear three-quarter view)
const SHIP_TURN = new Euler(0.3, -1.15, 0.08, "YXZ");

// Page fade (seconds): out fast when leaving home, in once the camera has nearly arrived
const FADE_OUT = 0.4;
const FADE_IN = 0.6;
const FADE_IN_DELAY = 0.8;

/* Spaceship floating above and right of the center in the home view; fades out on other pages */
const Spaceship = ({ page }) => {
  const size = useThree((state) => state.size);
  const variant = size.width < size.height ? "portrait" : "landscape";
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const transform = useMemo(() => getShipTransform(variant), [variant]);
  const orientation = useMemo(
    () => transform.quaternion.clone().multiply(new Quaternion().setFromEuler(SHIP_TURN)),
    [transform]
  );
  // "Up" on screen in the home view, for the floating bob
  const screenUp = useMemo(() => new Vector3(0, 1, 0).applyQuaternion(transform.quaternion), [transform]);

  // A soft studio-like reflection map (generated, no image file) so the metal and glass shine
  const gl = useThree((state) => state.gl);
  const envMap = useMemo(() => {
    const generator = new PMREMGenerator(gl);
    const texture = generator.fromScene(new RoomEnvironment(), 0.04).texture;
    generator.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => envMap.dispose(), [envMap]);

  const materials = useMemo(() => createShipMaterials(envMap), [envMap]);
  const glowUniforms = useMemo(() => ({ uPulse: { value: 1 }, uOpacity: { value: 1 } }), []);

  const groupRef = useRef();
  const glowRefs = useRef([]);
  const state = useRef({ page, fade: page === "home" ? 1 : 0, wait: 0, time: 0 });
  const helpers = useMemo(() => ({ sway: new Quaternion(), euler: new Euler(), inverse: new Quaternion() }), []);

  useFrame(({ camera }, frameDelta) => {
    const group = groupRef.current;
    const s = state.current;
    const delta = Math.min(frameDelta, 0.1);
    const isHome = page === "home";

    // Fade: wait for the camera before fading back in on home
    if (s.page !== page) {
      s.page = page;
      if (isHome) s.wait = FADE_IN_DELAY;
    }
    if (reduceMotion) {
      s.fade = isHome ? 1 : 0;
    } else if (isHome) {
      if (s.wait > 0) s.wait -= delta;
      else s.fade = Math.min(1, s.fade + delta / FADE_IN);
    } else {
      s.fade = Math.max(0, s.fade - delta / FADE_OUT);
    }

    group.visible = s.fade > 0;
    if (!group.visible) return;
    // Opaque at rest (no sorting issues), transparent only while fading
    for (const material of Object.values(materials)) {
      material.transparent = s.fade < 1;
      material.opacity = s.fade;
    }
    glowUniforms.uOpacity.value = s.fade;

    // Float: slow bob, gentle sway, throbbing engines; reduced motion keeps it still
    if (!reduceMotion) s.time += delta;
    const t = s.time;
    group.position.copy(transform.position).addScaledVector(screenUp, Math.sin(t * 0.6) * 0.08);
    helpers.euler.set(Math.sin(t * 0.5) * 0.02, 0, Math.sin(t * 0.4) * 0.03);
    group.quaternion.copy(orientation).multiply(helpers.sway.setFromEuler(helpers.euler));
    glowUniforms.uPulse.value = reduceMotion ? 1 : 0.85 + 0.15 * Math.sin(t * 6);
    // Navigation lights on the fin tips: a short blink every 1.6 s (steady with reduced motion)
    materials.navLight.color.setScalar(reduceMotion || t % 1.6 < 0.15 ? 1 : 0.12);

    // The engine glows are flat planes: turn them to face the camera
    helpers.inverse.copy(group.quaternion).invert();
    for (const glow of glowRefs.current) glow?.quaternion.copy(helpers.inverse).multiply(camera.quaternion);
  });

  return (
    <>
      {/* Only the ship uses lit materials; the earth, sun and stars have their own shaders.
          The sun lights it from ahead (a warm rim); a soft fill from the camera's side keeps
          the hull we look at white instead of in shadow. */}
      <directionalLight position={SUN_DIR.clone().multiplyScalar(50).toArray()} intensity={2.5} color="#fff1dc" />
      <directionalLight position={[-20, 15, 30]} intensity={1.6} color="#e4ebff" />
      <ambientLight intensity={0.8} color="#9aa8c8" />

      <group ref={groupRef}>
        <SpaceshipModel materials={materials} glowUniforms={glowUniforms} glowRefs={glowRefs} />
      </group>
    </>
  );
};

export default Spaceship;
