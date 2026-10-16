import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useMediaQuery } from "@mui/material";
import { CAMERA_POSES, applyPose, getFov, lerpPose } from "../scene";

const DURATION = 1.6; // seconds per page transition

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* Moves the camera to the current page's pose: instantly on load, on an eased arc when the page changes */
const CameraRig = ({ page }) => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Transition state lives in a ref, so the frames never re-render React
  const rig = useRef(null);

  useFrame(({ camera, size }, frameDelta) => {
    const aspect = size.width / size.height;
    const variant = aspect < 1 ? "portrait" : "landscape";
    const target = (CAMERA_POSES[page] ?? CAMERA_POSES.home)[variant];

    // First frame, or the screen flipped between portrait and landscape: jump straight there
    if (!rig.current || rig.current.variant !== variant) {
      rig.current = { page, variant, from: target, to: target, current: target, progress: 1 };
    } else if (rig.current.page !== page) {
      // New page: leave from wherever the camera is now (also mid-transition)
      rig.current = {
        page,
        variant,
        from: rig.current.current,
        to: target,
        current: rig.current.current,
        progress: reduceMotion ? 1 : 0,
      };
    }

    const r = rig.current;
    if (r.progress < 1) {
      // Capped so a long-hidden tab doesn't skip the whole move
      r.progress = Math.min(1, r.progress + Math.min(frameDelta, 0.1) / DURATION);
      r.current = lerpPose(r.from, r.to, easeInOutCubic(r.progress));
    } else {
      r.current = r.to;
    }

    const fov = getFov(aspect, r.current.zoom);
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    applyPose(camera, r.current);
  });

  return null;
};

export default CameraRig;
