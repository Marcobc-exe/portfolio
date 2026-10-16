import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import HomePage from "../Pages/Home/HomePage";
import Layout from "../components/Layout/Layout";
import ContactPage from "../Pages/Contact/ContactPage";
import AboutPage from "../Pages/About/AboutPage";
import WorkPage from "../Pages/Work/WorkPage";

// Matches the .layoutContent.leaving transition in Layout/styles/index.css
const LEAVE_MS = 250;

/*
  Page transitions: the old page fades out while the camera starts moving (phase "leaving"),
  then the new page is rendered and fades in as the camera arrives (phase "entering").
  Routes renders displayedLocation, so the old page stays mounted while it fades.
*/
const AppRouter = () => {
  const location = useLocation();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [phase, setPhase] = useState("idle"); // "idle" on first load: no animation

  useEffect(() => {
    if (location.pathname === displayedLocation.pathname) return;

    if (reduceMotion) {
      setDisplayedLocation(location);
      setPhase("idle");
      return;
    }

    setPhase("leaving");
    const timeoutId = setTimeout(() => {
      setDisplayedLocation(location);
      setPhase("entering");
    }, LEAVE_MS);

    return () => clearTimeout(timeoutId);
  }, [location, displayedLocation.pathname, reduceMotion]);

  return (
    <Layout transitionPhase={phase}>
      <Routes location={displayedLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default AppRouter;
