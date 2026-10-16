import { Box } from "@mui/material";
import "./styles/index.css";
import { Email } from "../../components/Email/Email";
import { Internet } from "../../components/Internet/Internet";

const ContactPage = () => {
  return (
    <Box className="containerContact">
      <Box className="boxTitleContact">
        <span className="txtTitleContact">Make contact...</span>
      </Box>

      <Box className="boxLinksContact">
        <Email key={"email"} />
        <Internet key={"internet"} />
      </Box>
    </Box>
  );
};

export default ContactPage;
