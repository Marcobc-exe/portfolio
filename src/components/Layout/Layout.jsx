import { Box } from "@mui/material";
import {
  StyledLink,
  styleLink,
  styleLayout,
  styleHoverLink,
} from "./styles/styles";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { capitalizeText } from "../../utils/Capitalize";
import { arrPaths } from "../../constants/menuPaths";
import useHoverLink from "../../hooks/useHoverLink";
import "./styles/index.css";
import CursorPro from "../CursorPro/CursorPro";
import useCursorEvents from "../../hooks/useCursorEvents";

/* Layout + Canvas three js? */
const Layout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { hoverLink } = useHoverLink();
  const { setOnHoverEvent, removeOnHoverEvent, setSelectedEvent } = useCursorEvents();

  const [onHover, setOnHover] = useState(false);
  const [onHoverId, setOnHoverId] = useState(null);
  const [activedLink, setActivedLink] = useState(hoverLink);

  const classes = styleLayout(currentPath, activedLink);

  const handleLinks = (event) => {
    const id = event.target.id;

    if (activedLink === id) return;

    const srtLink = JSON.stringify(id);
    window.sessionStorage.setItem("hoverLink", srtLink);

    setActivedLink(id);
    setSelectedEvent(id);
  };

  const handleMouseEnter = (event) => {
    if (!onHover) {
      setOnHover(true);
      setOnHoverId(event.target.id);
      setOnHoverEvent();
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      setOnHoverId(null);
      setOnHover(false);
      removeOnHoverEvent();
    }
  };

  return (
    <Box style={classes.layout}>
      <Box style={classes.containerNavbar}>
        <Box style={classes.containerLinks}>
          {arrPaths.map((arrPath, index) => (
            <Box key={index} style={classes.containerLink}>
              <div style={classes.containerHoverLink}>
                {onHover && (
                  <div
                    id={arrPath.id}
                    style={styleHoverLink(arrPath.id, onHoverId, activedLink)}
                  />
                )}
              </div>

              <StyledLink
                id={arrPath.id}
                to={arrPath.path}
                onClick={(event) => handleLinks(event)}
                onMouseEnter={(event) => handleMouseEnter(event)}
                onMouseLeave={() => handleMouseLeave()}
                style={styleLink(arrPath.id, activedLink)}
              >
                {capitalizeText(arrPath.id)}
              </StyledLink>
            </Box>
          ))}
        </Box>
      </Box>
      <CursorPro />
      {children}
    </Box>
  );
};

export default Layout;
