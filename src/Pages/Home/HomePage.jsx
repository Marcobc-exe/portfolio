import "./styles/index.css"
import { Box } from "@mui/material";
// import useCursorEvents from "../../hooks/useCursorEvents";

const HomePage = () => {
  // const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  // const handleMouseEnter = (e) => {
  //   setOnHoverEvent(e.target.id);
  // };

  // const handleMouseLeave = () => {
  //   removeOnHoverEvent();
  // };

  return (
    <Box className="homePage">
      <span className="txtFullName">Marco Bravo</span>
      <span className="txtRole">React Front-end Developer</span>

      {/* <span className="txtRole">
        Currently working at{" "}
        <a
          id="linkCompany"
          className={"linkCompany"}
          href="https://www.agrosat.cl/"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Agrosat International
        </a>
      </span> */}
    </Box>
  );
};

export default HomePage;
