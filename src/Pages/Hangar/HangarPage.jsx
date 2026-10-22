/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Quaternion } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Link } from "react-router-dom";
import SpaceshipModel from "../../components/Canvas3D/Spaceship/SpaceshipModel";
import useShipMaterials from "../../components/Canvas3D/Spaceship/useShipMaterials";
import "./styles/index.css";

/*
  Dev-only inspection view for the spaceship (#/hangar, only with `npm start`): the ship alone on a
  grid, orbit with the mouse, preset views, turntable, wireframe and PNG download.
*/

// The ship is ~5.7 units long (cannon tips at z -3.07, engine glow at z 2.45), nose toward -z
const TARGET = [0, 0, -0.3];
const VIEWS = {
  front34: { label: "3/4 frontal", position: [-5.2, 2.6, -6.6] },
  rear34: { label: "3/4 trasera", position: [5.2, 2.6, 6] },
  side: { label: "Lateral", position: [9.5, 0.4, -0.3] },
  front: { label: "Frontal", position: [0, 0.5, -9.5] },
  rear: { label: "Trasera", position: [0, 0.5, 9] },
  top: { label: "Superior", position: [0, 12, -0.29] },
  bottom: { label: "Inferior", position: [0, -12, -0.29] },
};

const HangarScene = ({ view, autoRotate, wireframe }) => {
  const { camera, gl } = useThree();
  const materials = useShipMaterials();
  const glowUniforms = useMemo(() => ({ uPulse: { value: 1 }, uOpacity: { value: 1 } }), []);
  const glowRefs = useRef([]);
  const shipRef = useRef();
  const inverse = useMemo(() => new Quaternion(), []);

  const controls = useMemo(() => {
    const orbit = new OrbitControls(camera, gl.domElement);
    orbit.enableDamping = true;
    orbit.minDistance = 4;
    orbit.maxDistance = 20;
    orbit.autoRotateSpeed = 1.2;
    return orbit;
  }, [camera, gl]);
  useEffect(() => () => controls.dispose(), [controls]);

  // Jump to a preset view (view.n changes on every click, so the same view can be re-applied)
  useEffect(() => {
    camera.position.set(...VIEWS[view.name].position);
    controls.target.set(...TARGET);
    controls.update();
  }, [view, camera, controls]);

  useEffect(() => {
    controls.autoRotate = autoRotate;
  }, [controls, autoRotate]);

  useEffect(() => {
    for (const material of Object.values(materials)) material.wireframe = wireframe;
  }, [materials, wireframe]);

  useFrame(({ clock }) => {
    controls.update();
    const t = clock.elapsedTime;
    glowUniforms.uPulse.value = 0.85 + 0.15 * Math.sin(t * 6);
    materials.navLight.color.setScalar(t % 1.6 < 0.15 ? 1 : 0.12);
    // Engine glows face the camera, as in the main scene
    inverse.copy(shipRef.current.quaternion).invert();
    for (const glow of glowRefs.current) glow?.quaternion.copy(inverse).multiply(camera.quaternion);
  });

  return (
    <>
      <color attach="background" args={["#121417"]} />
      <gridHelper args={[16, 32, "#2b6f73", "#1c3a3d"]} position={[0, -1.3, -0.3]} />

      {/* Studio lights: warm key, cool fill, rim from behind */}
      <directionalLight position={[6, 8, 4]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-6, 3, -4]} intensity={1.1} color="#dbe6ff" />
      <directionalLight position={[0, 4, -9]} intensity={0.8} color="#ffffff" />
      <ambientLight intensity={0.6} color="#9aa8c8" />

      <group ref={shipRef}>
        <SpaceshipModel materials={materials} glowUniforms={glowUniforms} glowRefs={glowRefs} />
      </group>
    </>
  );
};

const HangarPage = () => {
  const [view, setView] = useState({ name: "rear34", n: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const glRef = useRef(null);

  const download = () => {
    const link = document.createElement("a");
    link.download = `spaceship-${view.name}${wireframe ? "-wireframe" : ""}.png`;
    link.href = glRef.current.domElement.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="hangar">
      <Canvas
        className="hangarCanvas"
        camera={{ fov: 35, near: 0.1, far: 200, position: VIEWS.rear34.position }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => (glRef.current = gl)}
      >
        <HangarScene view={view} autoRotate={autoRotate} wireframe={wireframe} />
      </Canvas>

      <header className="hangarHeader">
        <h1>Hangar</h1>
        <p>Arrastra para girar · rueda para zoom · clic derecho para mover</p>
        <Link to="/">← Volver al portfolio</Link>
      </header>

      <nav className="hangarToolbar" aria-label="Vistas de la nave">
        {Object.entries(VIEWS).map(([name, { label }]) => (
          <button
            key={name}
            data-view={name}
            className={view.name === name ? "active" : ""}
            onClick={() => setView((current) => ({ name, n: current.n + 1 }))}
          >
            {label}
          </button>
        ))}
        <span className="hangarDivider" />
        <button data-toggle="rotate" className={autoRotate ? "active" : ""} onClick={() => setAutoRotate(!autoRotate)}>
          Girar
        </button>
        <button data-toggle="wireframe" className={wireframe ? "active" : ""} onClick={() => setWireframe(!wireframe)}>
          Malla
        </button>
        <button data-action="download" onClick={download}>
          Descargar PNG
        </button>
      </nav>
    </div>
  );
};

export default HangarPage;
