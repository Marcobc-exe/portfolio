import { Box, Link } from "@mui/material";
import "./styles/index.css";
import { useState } from "react";
import useCursorEvents from "../../hooks/useCursorEvents";
import { projects } from "../../constants/projects";

const WorkPage = () => {
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
    <Box className="containerWorkPage">
      {projects.map(({ year, name, type, repo }) => (
        <Link
          key={repo}
          className="containerLkProyect"
          href={repo}
          underline="none"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
        >
          <span className="txtYearProyect">{year}</span>
          <span className="txtNameProyect">{name}</span>
          <span className="txtTypeProyect">{type}</span>
        </Link>
      ))}
    </Box>
  );
};

export default WorkPage;
