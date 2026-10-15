import { Box } from "@mui/material";
import { styleLayout } from "./styles/styles";
import useCursorEvents from "../../hooks/useCursorEvents";
import "./styles/index.css";
import CursorPro from "../CursorPro/CursorPro";
import { Navbar } from "../Navbar/Navbar";
import Canvas3D from "../Canvas3D/Canvas";

/* Layout + Canvas three js? */
const Layout = ({ children }) => {
  const { selected } = useCursorEvents();

  const classes = styleLayout();

  return (
    <Box style={classes.layout}>
      <Navbar
        key={"navbar"}
        classes={classes}
        activedLink={selected}
      />
      <CursorPro key={"custom-cursor"} />
      <Canvas3D key={"canvas"} />
      {children}
    </Box>
  );
};

export default Layout;
