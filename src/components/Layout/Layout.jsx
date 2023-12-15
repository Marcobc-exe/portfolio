import { Box } from "@mui/material";
import { styleLayout } from "./styles/styles";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import useHoverLink from "../../hooks/useHoverLink";
import "./styles/index.css";
import CursorPro from "../CursorPro/CursorPro";
import { Navbar } from "../Navbar/Navbar";

/* Layout + Canvas three js? */
const Layout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const { hoverLink } = useHoverLink();

  const [activedLink, setActivedLink] = useState(hoverLink);

  const classes = styleLayout(currentPath, activedLink);

  return (
    <Box style={classes.layout}>
      <Navbar
        key={"navbar"}
        classes={classes}
        activedLink={activedLink}
        setActivedLink={setActivedLink}
      />
      <CursorPro />
      {children}
    </Box>
  );
};

export default Layout;
