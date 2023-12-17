import { Box } from "@mui/material";
import { useState } from "react";
import useCursorEvents from "../../hooks/useCursorEvents";
import { arrPaths } from "../../constants/menuPaths";
import { StyledLink, styleHoverLink, styleLink } from "../Layout/styles/styles";
import { capitalizeText } from "../../utils/Capitalize";

export const Navbar = ({ classes, activedLink, setActivedLink }) => {
  const [onHover, setOnHover] = useState(false);
  const [onHoverId, setOnHoverId] = useState(null);
  const { setOnHoverEvent, removeOnHoverEvent, setSelectedEvent } = useCursorEvents();

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
  );
};
