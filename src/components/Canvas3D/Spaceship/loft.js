import { BufferGeometry, Float32BufferAttribute } from "three";

/*
  Builds a closed hull by joining cross-sections along z. A profile is a list of [x, y] multipliers
  (x times the half-width w; y times the height t above / b below the center line y), ordered
  left -> over the top -> right -> under the bottom. With flatShading every face reads as a flat panel.
*/
export const HEXAGON = [[-1, 0], [-0.7, 1], [0.7, 1], [1, 0], [0.7, -1], [-0.7, -1]];
export const OCTAGON = [[-1, 0], [-0.88, 0.6], [-0.45, 1], [0.45, 1], [0.88, 0.6], [1, 0], [0.75, -1], [-0.75, -1]];

const section = ({ z, w, t, b, y = 0 }, profile) =>
  profile.map(([px, py]) => [px * w, y + (py >= 0 ? py * t : py * b), z]);

export const loftGeometry = (stations, profile = HEXAGON) => {
  const rings = stations.map((station) => section(station, profile));
  const sides = profile.length;
  const positions = [];
  const triangle = (a, b, c) => positions.push(...a, ...b, ...c);

  // Side panels between consecutive stations (wound so the faces point outward)
  for (let s = 0; s < rings.length - 1; s++) {
    for (let i = 0; i < sides; i++) {
      const a = rings[s][i];
      const b = rings[s][(i + 1) % sides];
      const c = rings[s + 1][(i + 1) % sides];
      const d = rings[s + 1][i];
      triangle(a, c, b);
      triangle(a, d, c);
    }
  }

  // End caps: the first station faces -z, the last one +z
  const cap = (ring, front) => {
    const center = ring.reduce((sum, p) => sum.map((v, k) => v + p[k] / ring.length), [0, 0, 0]);
    for (let i = 0; i < sides; i++) {
      const next = ring[(i + 1) % sides];
      if (front) triangle(center, ring[i], next);
      else triangle(center, next, ring[i]);
    }
  };
  cap(rings[0], true);
  cap(rings[rings.length - 1], false);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
};

// Linear interpolation of a station value (w, t, b...) at any z along the stations
export const stationValue = (stations, key, z) => {
  if (z <= stations[0].z) return stations[0][key];
  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i];
    const b = stations[i + 1];
    if (z <= b.z) return a[key] + ((b[key] - a[key]) * (z - a.z)) / (b.z - a.z);
  }
  return stations[stations.length - 1][key];
};
