import { Box } from "@mui/material";
import useCursorEvents from "../../hooks/useCursorEvents";
import "./index.css";
import { github, linkedIn } from "../../constants/urls";

export const Internet = ({ classes }) => {
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  const handleMouseEnter = (e) => {
    setOnHoverEvent(e.target.id);
  };

  const handleMouseLeave = () => {
    removeOnHoverEvent();
  };

  return (
    <Box style={classes.boxInternet}>
      <span>Internet:</span>
      <span
        id="internet"
        className="txtInternet"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a
          style={classes.linkLinkedIn}
          href={linkedIn}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </span>

      <span
        id="internet"
        className="txtInternet"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a
          style={classes.linkGitHub}
          href={github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </span>
    </Box>
  );
};
