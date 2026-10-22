import { Box, Link } from "@mui/material";
import "./styles/index.css";
import { useState } from "react";
import useCursorEvents from "../../hooks/useCursorEvents";
import { projects } from "../../constants/projects";

const ProjectsPage = () => {
  const [onHover, setOnHover] = useState(false);
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  const handleMouseEnter = () => {
    if (!onHover) {
      setOnHover(true);
      setOnHoverEvent();
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      setOnHover(false);
      removeOnHoverEvent();
    }
  };

  return (
    <Box className="containerProjectsPage">
      {projects.map(({ year, name, type, repo }) => (
        <Link
          key={repo}
          className="containerLkProject"
          href={repo}
          underline="none"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
        >
          <span className="txtYearProject">{year}</span>
          <span className="txtNameProject">{name}</span>
          <span className="txtTypeProject">{type}</span>
        </Link>
      ))}
    </Box>
  );
};

export default ProjectsPage;
