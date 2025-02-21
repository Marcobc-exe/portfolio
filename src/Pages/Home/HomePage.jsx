import { Box } from "@mui/material";
import { styleHomePage } from "./styles/style";
// import useCursorEvents from "../../hooks/useCursorEvents";
import "./styles/index.css"

const HomePage = () => {
  const classes = styleHomePage();
  // const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  // const handleMouseEnter = (e) => {
  //   setOnHoverEvent(e.target.id);
  // };

  // const handleMouseLeave = () => {
  //   removeOnHoverEvent();
  // };

  return (
    <Box style={classes.containerTitle}>
      <Box style={classes.boxFullName}>
        <span style={classes.txtFullName}>Marco Bravo C.</span>
      </Box>

      <Box style={classes.boxSubtitle}>
        <Box style={classes.boxRole}>
          <span>Semi-senior Front-end Developer</span>
        </Box>

        {/* <Box style={classes.boxCompany}>
          <span>
            Currently working at{" "}
            <a
              id="linkCompany"
              style={classes.linkCompany}
              className={"linkCompany"}
              href="https://www.agrosat.cl/"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Agrosat International
            </a>
          </span>
        </Box> */}
      </Box>
    </Box>
  );
};

export default HomePage;
