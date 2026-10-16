import { MeshBasicMaterial, MeshStandardMaterial, Vector2 } from "three";

/*
  Panel lines: patches three's standard material so the surface is split into staggered panels
  with thin dark seams and a slight brightness change per panel, like plating on the reference.
  The pattern is projected along the dominant axis of the object-space normal (triplanar-style).
*/
const PANEL_VARYINGS = /* glsl */ `
varying vec3 vPanelPosition;
varying vec3 vPanelNormal;
`;

const PANEL_FRAGMENT = /* glsl */ `
vec3 panelAxis = abs(normalize(vPanelNormal));
vec2 panelUv = (panelAxis.x > panelAxis.y && panelAxis.x > panelAxis.z) ? vPanelPosition.zy
  : (panelAxis.y > panelAxis.z ? vPanelPosition.xz : vPanelPosition.xy);
vec2 panelP = panelUv / uPanelCell;
panelP.x += mod(floor(panelP.y), 2.0) * 0.5; // staggered rows
vec2 panelF = fract(panelP);
vec2 panelEdge = min(panelF, 1.0 - panelF) * uPanelCell;
float panelDist = min(panelEdge.x, panelEdge.y);
float panelSeam = 1.0 - smoothstep(0.0, max(fwidth(panelDist) * 1.2, 0.004), panelDist);
float panelTint = 0.96 + 0.04 * fract(sin(dot(floor(panelP), vec2(12.9898, 78.233))) * 43758.5453);
diffuseColor.rgb *= panelTint * (1.0 - uPanelStrength * panelSeam);
`;

const addPanels = (material, cell, strength) => {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPanelCell = { value: new Vector2(...cell) };
    shader.uniforms.uPanelStrength = { value: strength };
    shader.vertexShader =
      PANEL_VARYINGS +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvPanelPosition = position;\nvPanelNormal = normal;"
      );
    shader.fragmentShader =
      PANEL_VARYINGS +
      "uniform vec2 uPanelCell;\nuniform float uPanelStrength;\n" +
      shader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n" + PANEL_FRAGMENT);
  };
  material.customProgramCacheKey = () => `panels-${cell.join("-")}-${strength}`;
  return material;
};

export const BURGUNDY = "#6a1426";

/* All the ship's materials; envMap gives the white hull, glass and metal some reflections */
export const createShipMaterials = (envMap) => {
  const standard = (options) =>
    new MeshStandardMaterial({ envMap, envMapIntensity: 0.7, flatShading: true, ...options });

  return {
    hull: addPanels(standard({ color: "#dedfe6", metalness: 0.2, roughness: 0.5 }), [0.55, 0.3], 0.28),
    burgundy: addPanels(standard({ color: BURGUNDY, metalness: 0.35, roughness: 0.4 }), [0.5, 0.3], 0.2),
    recess: standard({ color: "#2a2d33", metalness: 0.3, roughness: 0.7 }),
    detail: standard({ color: "#5b616b", metalness: 0.45, roughness: 0.5 }),
    glass: standard({ color: "#0b0f17", metalness: 0.9, roughness: 0.08, envMapIntensity: 1.2 }),
    metal: standard({ color: "#6b7280", metalness: 0.8, roughness: 0.3 }),
    red: standard({ color: "#c0392b", metalness: 0.2, roughness: 0.5 }),
    // Unlit: the engines' hot cores and the blinking navigation lights
    core: new MeshBasicMaterial({ color: "#bfe6ff", toneMapped: false }),
    navLight: new MeshBasicMaterial({ color: "#ffffff", toneMapped: false }),
  };
};
