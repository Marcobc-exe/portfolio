import { Box } from "@mui/material";
import { useState } from "react";
import useCursorEvents from "../../hooks/useCursorEvents";
import { arrPaths } from "../../constants/menuPaths";
import { StyledLink, styleHoverLink, styleLink } from "../Layout/styles/styles";
import { capitalizeText } from "../../utils/Capitalize";
import "./index.css";

export const Navbar = ({ activedLink }) => {
  const [onHover, setOnHover] = useState(false);
  const [onHoverId, setOnHoverId] = useState(null);
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

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
    <Box component="nav" className="navbar">
      <Box className="navLinks">
        {arrPaths.map((arrPath, index) => (
          <Box key={index} className="navItem">
            <div className="navDot">
              {onHover && (
                <div
                  style={styleHoverLink(arrPath.id, onHoverId, activedLink)}
                />
              )}
            </div>

            <StyledLink
              className="navLink"
              id={arrPath.id}
              to={arrPath.path}
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
