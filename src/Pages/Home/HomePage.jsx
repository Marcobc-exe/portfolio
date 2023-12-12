import { Box } from "@mui/material";
import { styleBoxContainer } from "./styles/style";

const HomePage = () => {
  const classes = styleBoxContainer();

  return (
    <Box style={classes.containerTitle}>
      <Box style={classes.boxFullName}>
        <span style={classes.txtFullName}>Marco Bravo C.</span>
      </Box>

      <Box style={classes.boxSubtitle}>
        <Box style={classes.boxRole}>
          <span>React Front-end Developer</span>
        </Box>

        <Box style={classes.boxCompany}>
          <span>Currently working at Agrosat International</span>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
