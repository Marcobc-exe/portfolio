import { Vector3 } from "three";

// The earth sits at the world origin; everything else is placed around it
export const EARTH_RADIUS = 4;

// Direction the sunlight comes from (world space). The home camera looks straight down -z,
// so from there the light comes from the upper right and a bit from behind the planet
export const SUN_DIR = new Vector3(1.0, 0.3, -0.5).normalize();

// Where the sun is drawn: far away, straight ahead of the home camera (center of the screen)
export const SUN_POSITION = [99.03, 27.83, -154.52];

/*
  One fixed camera pose per page. Each pose is:
  - azimuth / elevation (degrees) and distance: where the camera orbits around the earth
  - yaw / pitch (degrees): how far the camera turns right / up from looking straight at the earth
  - zoom (optional, default 1): narrows the field of view, like a telephoto lens
  Transitions interpolate these numbers, so the camera always travels on an arc around the planet.
  "portrait" is used when the screen is taller than wide (phones held upright).
*/
export const CAMERA_POSES = {
  home: {
    landscape: { azimuth: 0, elevation: 0, distance: 17, yaw: 30, pitch: 8 },
    portrait: { azimuth: -10, elevation: 26, distance: 18, yaw: 14, pitch: 6 },
  },
  // Around to the night side: the whole globe on the left, city lights, the sun rising over its edge
  work: {
    landscape: { azimuth: -20, elevation: 8, distance: 19, yaw: 14, pitch: 8 },
    portrait: { azimuth: -48, elevation: 34, distance: 14, yaw: 12, pitch: 28 },
  },
  // Up above, looking down: the globe at the bottom, the text in the space above it
  about: {
    landscape: { azimuth: -20, elevation: 35, distance: 17, yaw: 0, pitch: 18 },
    portrait: { azimuth: -18, elevation: 50, distance: 38, yaw: 0, pitch: 8 },
  },
  // Pulled back and zoomed toward the sun: a bigger sun, the earth a small corner at the bottom left
  contact: {
    landscape: { azimuth: -25, elevation: 8, distance: 48, yaw: 14, pitch: 10, zoom: 1.4 },
    portrait: { azimuth: -26, elevation: 22, distance: 50, yaw: 4, pitch: 12, zoom: 1.6 },
  },
};

// Vertical field of view: 35° on wide screens; narrower ones widen it (up to 55°) so the
// horizontal framing of a 1440 x 900 desktop is kept
export const BASE_FOV = 35;
export const MAX_FOV = 55;
export const DESKTOP_ASPECT = 1368 / 828;

export const getFov = (aspect, zoom = 1) => {
  const tanHalfHorizontal = Math.tan((BASE_FOV * Math.PI) / 360) * DESKTOP_ASPECT;
  const fov = (2 * Math.atan(tanHalfHorizontal / aspect) * 180) / Math.PI;
  return Math.min(MAX_FOV, Math.max(BASE_FOV, fov)) / zoom;
};

const toRad = (deg) => (deg * Math.PI) / 180;

// Places the camera for a pose: on its orbit around the earth, then turned by yaw / pitch
export const applyPose = (camera, pose) => {
  const azimuth = toRad(pose.azimuth);
  const elevation = toRad(pose.elevation);
  camera.position.set(
    pose.distance * Math.cos(elevation) * Math.sin(azimuth),
    pose.distance * Math.sin(elevation),
    pose.distance * Math.cos(elevation) * Math.cos(azimuth)
  );
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.rotateY(-toRad(pose.yaw));
  camera.rotateX(toRad(pose.pitch));
};

// Interpolates two poses; the azimuth takes the shorter way around
export const lerpPose = (from, to, t) => {
  const azimuthDelta = ((((to.azimuth - from.azimuth) % 360) + 540) % 360) - 180;
  const lerp = (a, b) => a + (b - a) * t;
  return {
    azimuth: from.azimuth + azimuthDelta * t,
    elevation: lerp(from.elevation, to.elevation),
    distance: lerp(from.distance, to.distance),
    yaw: lerp(from.yaw, to.yaw),
    pitch: lerp(from.pitch, to.pitch),
    zoom: lerp(from.zoom ?? 1, to.zoom ?? 1),
  };
};
