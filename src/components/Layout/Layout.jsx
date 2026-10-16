import "./styles/index.css";
import { Box } from "@mui/material";
import useCursorEvents from "../../hooks/useCursorEvents";
import CursorPro from "../CursorPro/CursorPro";
import { Navbar } from "../Navbar/Navbar";
import Canvas3D from "../Canvas3D/Canvas";

/* Bordered frame (CSS grid): globe behind everything, page in the "main" area, Navbar on top.
   transitionPhase ("idle" | "leaving" | "entering") fades the page during camera moves (see AppRouter) */
const Layout = ({ children, transitionPhase = "idle" }) => {
  const { selected } = useCursorEvents();

  return (
    <Box className="layout">
      <Canvas3D key={"canvas"} page={selected} />
      <Box component="main" className={`layoutContent ${transitionPhase}`}>
        {children}
      </Box>
      <Navbar key={"navbar"} activedLink={selected} />
      <CursorPro key={"custom-cursor"} />
    </Box>
  );
};

export default Layout;
