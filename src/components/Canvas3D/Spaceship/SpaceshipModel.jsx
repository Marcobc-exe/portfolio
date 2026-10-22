/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { AdditiveBlending, ExtrudeGeometry, Quaternion, Shape, Vector3 } from "three";
import { OCTAGON, loftGeometry, stationValue } from "./loft";
import engineGlowVertex from "../shaders/engineGlowVertex.glsl";
import engineGlowFragment from "../shaders/engineGlowFragment.glsl";

/*
  Procedural spaceship modeled on the reference: about 5.5 units long, nose toward -z, engines
  toward +z, top toward +y. Long flattened nose, octagonal hull with a raised spine, multi-pane
  canopy, side chines, two big ringed engine nacelles, tall tail fins, ventral fins, louvered
  vents, twin cannons and burgundy accents.
*/

// Main hull, from the flat chisel nose to the wide back
const HULL = [
  { z: -2.65, w: 0.24, t: 0.05, b: 0.05 },
  { z: -2.2, w: 0.38, t: 0.12, b: 0.1 },
  { z: -1.5, w: 0.47, t: 0.22, b: 0.16 },
  { z: -0.7, w: 0.6, t: 0.32, b: 0.22 },
  { z: 0.2, w: 0.7, t: 0.38, b: 0.26 },
  { z: 1.0, w: 0.74, t: 0.38, b: 0.28 },
  { z: 1.7, w: 0.68, t: 0.34, b: 0.26 },
  { z: 2.0, w: 0.56, t: 0.28, b: 0.2 },
];
const hullTop = (z) => stationValue(HULL, "t", z);
const hullWidth = (z) => stationValue(HULL, "w", z);

// Long canopy on top of the front half, and the dark well around it
const CANOPY_Z = [-1.75, -1.4, -0.9, -0.3, 0.1, 0.3];
const CANOPY_W = [0.06, 0.2, 0.26, 0.26, 0.21, 0.09];
const CANOPY_T = [0.03, 0.12, 0.17, 0.17, 0.11, 0.03];
const canopyStations = (grow) =>
  CANOPY_Z.map((z, i) => ({ z, w: CANOPY_W[i] + grow, t: CANOPY_T[i] * (grow ? 0.4 : 1), b: 0.02, y: hullTop(z) - 0.01 }));

// Raised spine along the back half of the top
const SPINE = [0.25, 0.6, 1.4, 1.9].map((z, i) => ({ z, w: [0.12, 0.26, 0.26, 0.2][i], t: 0.09, b: 0.02, y: hullTop(z) - 0.02 }));

const NACELLE_X = 0.98;

const extrudedShape = (points, depth) => {
  const shape = new Shape();
  shape.moveTo(...points[0]);
  points.slice(1).forEach((p) => shape.lineTo(...p));
  const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  // Outline drawn in (back, up); stand it in the y-z plane, centered on its thickness
  geometry.translate(0, 0, -depth / 2);
  geometry.rotateY(-Math.PI / 2);
  return geometry;
};

const Z_AXIS = new Vector3(0, 0, 1);

/* A thin bar between two 3D points, with a [width, height] cross-section */
const Strip = ({ from, to, size, material }) => {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const direction = b.clone().sub(a);
    return {
      position: a.add(b).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(Z_AXIS, direction.clone().normalize()),
      length: direction.length(),
    };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <boxGeometry args={[size[0], size[1], length]} />
    </mesh>
  );
};

/* A box (args) at a position; the most common greeble */
const Block = ({ args, position, rotation, material }) => (
  <mesh position={position} rotation={rotation} material={material}>
    <boxGeometry args={args} />
  </mesh>
);

/* A cylinder lying along z */
const Tube = ({ radius, length, z, x = 0, y = 0, sides = 12, material }) => (
  <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} material={material}>
    <cylinderGeometry args={[radius, radius, length, sides]} />
  </mesh>
);

const Nacelle = ({ side, m, geometries, glowUniforms, glowRef }) => (
  <group position={[side * NACELLE_X, -0.02, 0]}>
    {/* Faceted barrel inside a blocky cowling, joined to the hull by a pylon */}
    <Tube radius={0.37} length={1.7} z={1.45} sides={10} material={m.hull} />
    <Block args={[0.42, 0.62, 1.3]} position={[side * 0.12, 0, 1.35]} material={m.hull} />
    <Block args={[0.34, 0.14, 1.0]} position={[0, 0.34, 1.2]} material={m.hull} />
    <Block args={[0.36, 0.18, 0.9]} position={[-side * 0.36, 0.05, 1.2]} material={m.hull} />

    {/* Bands around the barrel, one in burgundy */}
    <Tube radius={0.385} length={0.07} z={0.95} sides={10} material={m.detail} />
    <Tube radius={0.39} length={0.12} z={1.72} sides={10} material={m.burgundy} />
    <Tube radius={0.385} length={0.07} z={2.12} sides={10} material={m.detail} />

    {/* Intake at the front */}
    <Tube radius={0.3} length={0.06} z={0.58} material={m.recess} />
    <mesh position={[0, 0, 0.6]} material={m.metal}>
      <torusGeometry args={[0.3, 0.035, 8, 20]} />
    </mesh>

    {/* Louvered vents on the outer side, a burgundy stripe on the cowling top */}
    {[-0.15, -0.075, 0, 0.075, 0.15].map((y) => (
      <Block key={y} args={[0.02, 0.045, 0.34]} position={[side * 0.335, y, 1.42]} material={m.recess} />
    ))}
    <Block args={[0.06, 0.012, 0.7]} position={[side * 0.08, 0.415, 1.15]} material={m.burgundy} />

    {/* Deep nozzle: metal ring, dark throat, hot core and its glow */}
    <mesh position={[0, 0, 2.3]} material={m.metal}>
      <torusGeometry args={[0.3, 0.08, 10, 24]} />
    </mesh>
    <Tube radius={0.27} length={0.25} z={2.18} material={m.recess} />
    <mesh position={[0, 0, 2.32]} material={m.core}>
      <circleGeometry args={[0.22, 24]} />
    </mesh>
    <mesh ref={glowRef} position={[0, 0, 2.45]}>
      <planeGeometry args={[1.3, 1.3]} />
      <shaderMaterial
        vertexShader={engineGlowVertex}
        fragmentShader={engineGlowFragment}
        uniforms={glowUniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>

    {/* Ventral fin, angled down and out, with a burgundy tip */}
    <group position={[side * 0.15, -0.32, 1.1]} rotation={[0, 0, side * 0.55]}>
      <mesh geometry={geometries.ventralFin} material={m.hull} />
      <mesh geometry={geometries.ventralTip} material={m.burgundy} />
    </group>
  </group>
);

const SpaceshipModel = ({ materials: m, glowUniforms, glowRefs }) => {
  const geometries = useMemo(
    () => ({
      hull: loftGeometry(HULL, OCTAGON),
      canopy: loftGeometry(canopyStations(0)),
      canopyWell: loftGeometry(canopyStations(0.05)),
      spine: loftGeometry(SPINE),
      tailFin: extrudedShape([[0, 0], [0.85, 0], [1.15, 0.82], [0.85, 0.82]], 0.045),
      tailTip: extrudedShape([[0.78, 0.6], [1.06, 0.6], [1.15, 0.82], [0.85, 0.82]], 0.055),
      ventralFin: extrudedShape([[0, 0], [0.75, 0], [0.95, -0.55], [0.62, -0.55]], 0.04),
      ventralTip: extrudedShape([[0.55, -0.42], [0.9, -0.42], [0.95, -0.55], [0.62, -0.55]], 0.05),
    }),
    []
  );

  return (
    <group>
      <mesh geometry={geometries.hull} material={m.hull} />

      {/* Canopy: dark well, glass, frame struts across and along it */}
      <mesh geometry={geometries.canopyWell} material={m.recess} />
      <mesh geometry={geometries.canopy} material={m.glass} />
      {[-1.4, -1.0, -0.6, -0.2].map((z) => {
        const i = CANOPY_Z.findIndex((cz) => cz > z);
        const t = CANOPY_T[i - 1] + ((CANOPY_T[i] - CANOPY_T[i - 1]) * (z - CANOPY_Z[i - 1])) / (CANOPY_Z[i] - CANOPY_Z[i - 1]);
        const w = CANOPY_W[i - 1] + ((CANOPY_W[i] - CANOPY_W[i - 1]) * (z - CANOPY_Z[i - 1])) / (CANOPY_Z[i] - CANOPY_Z[i - 1]);
        return <Block key={z} args={[w * 1.5, 0.022, 0.03]} position={[0, hullTop(z) + t - 0.005, z]} material={m.detail} />;
      })}
      <Strip from={[0, hullTop(-1.6) + 0.05, -1.6]} to={[0, hullTop(0.1) + 0.07, 0.1]} size={[0.025, 0.02]} material={m.detail} />

      {/* Spine with two burgundy stripes, hatches and an antenna */}
      <mesh geometry={geometries.spine} material={m.hull} />
      {[-1, 1].map((side) => (
        <Strip key={side} from={[side * 0.11, hullTop(0.6) + 0.075, 0.6]} to={[side * 0.1, hullTop(1.8) + 0.06, 1.8]} size={[0.035, 0.012]} material={m.burgundy} />
      ))}
      <Block args={[0.14, 0.02, 0.18]} position={[0, hullTop(1.0) + 0.08, 1.0]} material={m.recess} />
      <Block args={[0.14, 0.02, 0.12]} position={[0, hullTop(1.4) + 0.075, 1.4]} material={m.recess} />
      <mesh position={[0, hullTop(1.65) + 0.2, 1.65]} material={m.metal}>
        <cylinderGeometry args={[0.008, 0.008, 0.28, 6]} />
      </mesh>

      {/* Burgundy chevron on the nose */}
      {[-1, 1].map((side) => (
        <Strip key={side} from={[0, hullTop(-2.3) + 0.004, -2.3]} to={[side * 0.27, hullTop(-1.85) + 0.004, -1.85]} size={[0.05, 0.01]} material={m.burgundy} />
      ))}

      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Side chine along the flank, with a burgundy line over it */}
          <Strip from={[side * hullWidth(-1.9), 0, -1.9]} to={[side * hullWidth(1.6), 0, 1.6]} size={[0.06, 0.045]} material={m.hull} />
          <Strip from={[side * hullWidth(-1.3), 0.05, -1.3]} to={[side * hullWidth(1.2), 0.05, 1.2]} size={[0.02, 0.014]} material={m.burgundy} />

          {/* Emblem panel and side vents */}
          <Block args={[0.012, 0.14, 0.16]} position={[side * (hullWidth(-0.6) - 0.08), 0.18, -0.6]} rotation={[0, 0, side * -0.35]} material={m.recess} />
          <Block args={[0.014, 0.08, 0.1]} position={[side * (hullWidth(-0.6) - 0.075), 0.18, -0.6]} rotation={[0, 0, side * -0.35]} material={m.burgundy} />
          {[0.3, 0.42, 0.54].map((z) => (
            <Block key={z} args={[0.012, 0.1, 0.05]} position={[side * (hullWidth(z) + 0.005), -0.1, z]} material={m.recess} />
          ))}

          {/* Small red marks near the nose */}
          <Block args={[0.012, 0.03, 0.12]} position={[side * (hullWidth(-1.2) + 0.002), 0.08, -1.2]} material={m.red} />

          {/* Cannons under the nose: barrel, muzzle, red tip */}
          <Tube radius={0.028} length={1.8} z={-2.1} x={side * 0.13} y={-0.2} sides={8} material={m.metal} />
          <Tube radius={0.04} length={0.12} z={-2.85} x={side * 0.13} y={-0.2} sides={8} material={m.detail} />
          <Tube radius={0.034} length={0.08} z={-3.03} x={side * 0.13} y={-0.2} sides={8} material={m.red} />

          {/* Tall tail fin, canted out, with a burgundy tip and a blinking light */}
          <group position={[side * 0.42, hullTop(1.0) - 0.02, 0.95]} rotation={[0, 0, -side * 0.18]}>
            <mesh geometry={geometries.tailFin} material={m.hull} />
            <mesh geometry={geometries.tailTip} material={m.burgundy} />
            <mesh position={[0, 0.83, 1.0]} material={m.navLight}>
              <sphereGeometry args={[0.025, 8, 8]} />
            </mesh>
          </group>

          <Nacelle
            side={side}
            m={m}
            geometries={geometries}
            glowUniforms={glowUniforms}
            glowRef={(mesh) => (glowRefs.current[side < 0 ? 0 : 1] = mesh)}
          />
        </group>
      ))}

      {/* Housing for the cannons under the nose */}
      <Block args={[0.38, 0.1, 0.8]} position={[0, -stationValue(HULL, "b", -1.5) - 0.03, -1.45]} material={m.detail} />
    </group>
  );
};

export default SpaceshipModel;
