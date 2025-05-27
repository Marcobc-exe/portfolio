import { Box, Link } from "@mui/material";
import "./styles/index.css";
import { useState } from "react";
import useCursorEvents from "../../hooks/useCursorEvents";

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
      <Link
        className="containerLkProyect"
        href="https://www.fonel.ca/"
        underline="none"
        target="_blank"
        rel="noreferrer"
        onMouseEnter={(event) => handleMouseEnter(event)}
        onMouseLeave={() => handleMouseLeave()}
      >
        <span className="txtYearProyect">2025-05</span>
        <span className="txtNameProyect">Fonel Corp</span>
      </Link>
      <Link
        className="containerLkProyect"
        href="https://marcobc-exe.github.io/smartHarvest/"
        underline="none"
        target="_blank"
        rel="noreferrer"
        onMouseEnter={(event) => handleMouseEnter(event)}
        onMouseLeave={() => handleMouseLeave()}
      >
        <span className="txtYearProyect">2025-04</span>
        <span className="txtNameProyect">Smart Harvest</span>
      </Link>
      <Link
        className="containerLkProyect"
        href="https://marcobc-exe.github.io/memory-game/"
        underline="none"
        target="_blank"
        rel="noreferrer"
        onMouseEnter={(event) => handleMouseEnter(event)}
        onMouseLeave={() => handleMouseLeave()}
      >
        <span className="txtYearProyect">2024-03</span>
        <span className="txtNameProyect">Memory Game</span>
      </Link>
      <Link
        className="containerLkProyect"
        href="https://marcobc-exe.github.io/your-crop-app/"
        underline="none"
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        <span className="txtYearProyect">2023-07</span>
        <span className="txtNameProyect">YourCrop</span>
      </Link>
    </Box>
  );
};

export default WorkPage;
