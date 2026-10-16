import "./styles/index.css";
import { Box } from "@mui/material";
import useCursorEvents from "../../hooks/useCursorEvents";
import CursorPro from "../CursorPro/CursorPro";
import { Navbar } from "../Navbar/Navbar";
import Canvas3D from "../Canvas3D/Canvas";

/* Bordered frame (CSS grid): globe behind everything, page in the "main" area, Navbar on top */
const Layout = ({ children }) => {
  const { selected } = useCursorEvents();

  return (
    <Box className="layout">
      <Canvas3D key={"canvas"} />
      <Box component="main" className="layoutContent">
        {children}
      </Box>
      <Navbar key={"navbar"} activedLink={selected} />
      <CursorPro key={"custom-cursor"} />
    </Box>
  );
};

export default Layout;
