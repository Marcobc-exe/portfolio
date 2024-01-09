import { Box } from "@mui/material";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import useCursorEvents from "../../hooks/useCursorEvents";
import "./index.css"

export const Email = ({ classes }) => {
  const [isCopyEmail, setIsCopyEmail] = useState(false);
  const [isHoverEmail, setIsHoverEmail] = useState(false);
  // const { event } = useSelector((state) => state.cursor);
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  const handleMouseEnter = (e) => {
    setOnHoverEvent(e.target.id);
    if (!isCopyEmail) setIsHoverEmail(true);
  };

  const handleMouseLeave = () => {
    removeOnHoverEvent();
    setIsHoverEmail(false);
  };

  const copyEmail = (event) => {
    const email = event.target.innerText;
    let input = document.createElement("input");
    input.setAttribute("value", email);
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);

    setIsCopyEmail(true);

    if (isHoverEmail) setIsHoverEmail(false)
  };

  useEffect(() => {
    if (isCopyEmail) {
      setTimeout(() => {
        setIsCopyEmail(false);
      }, 2000);
    }
  }, [isCopyEmail]);

  return (
    <Box style={classes.boxEmail}>
      <span>Email:</span>
      <span
        id="email"
        className="txtEmail"
        value="marco.developing@gmail.com"
        onClick={copyEmail}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        marco.developing@gmail.com
      </span>
      {isCopyEmail && <span className={"txtCopied"}>Copied!</span>}
      {isHoverEmail && <span className={"txtCopy"}>Copy?</span>}
    </Box>
  );
};
