import { Box } from "@mui/material";
import { styleContactPage } from "./styles/styles";
import { Email } from "../../components/Email/Email";
import { Internet } from "../../components/Internet/Internet";

const ContactPage = () => {
  const classes = styleContactPage();

  return (
    <Box style={classes.containerContact}>
      <Box style={classes.boxTitleContact}>
        <span style={classes.txtTitleContact}>Make contact...</span>
      </Box>

      <Box style={classes.boxLinksContact}>
        <Email key={"email"} classes={classes}/>
        <Internet key={"internet"} classes={classes}/>        
      </Box>
    </Box>
  );
};

export default ContactPage;
