import { Box } from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import useCursorEvents from "../../hooks/useCursorEvents";
import "./index.css";
import { github, linkedIn } from "../../constants/urls";

export const Internet = () => {
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  const handleMouseEnter = () => {
    setOnHoverEvent();
  };

  const handleMouseLeave = () => {
    removeOnHoverEvent();
  };

  return (
    <Box className="boxInternet">
      <a
        className="linkInternet"
        href={linkedIn}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="txtInternet">LinkedIn</span>
        <OpenInNew className="iconExternal" fontSize="inherit" />
      </a>
      /
      <a
        className="linkInternet"
        href={github}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="txtInternet">GitHub</span>
        <OpenInNew className="iconExternal" fontSize="inherit" />
      </a>
    </Box>
  );
};
