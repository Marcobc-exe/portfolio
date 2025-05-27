import "./styles/index.css";
import { Box } from "@mui/material";

const AboutPage = () => {
  return (
    <Box className={"containerAbout"}>
      
      <Box className={"containerTitleAbout"}>
        <span>{"I'm Marco. "}</span>
        <span>Freelance Front-end developer.</span>
      </Box>

      <Box className={"containerBodyAbout"}>
        <Box className={"pro-description"}>
          <span>
            {
              "Passionate developer about building high-performance web applications. Creativity and resilience to design solutions for every problem."
            }
          </span>
        </Box>

        <Box className={"box-personal-desc"}>
          <span>
            {
              `"Motivation is only the first step, discipline is the infinite ladder of life."`
            }
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
