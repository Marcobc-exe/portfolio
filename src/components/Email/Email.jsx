import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import useCursorEvents from "../../hooks/useCursorEvents";
import "./index.css"

const EMAIL = "marco.developing@gmail.com";

export const Email = ({ classes }) => {
  const [isCopyEmail, setIsCopyEmail] = useState(false);
  const [isHoverEmail, setIsHoverEmail] = useState(false);
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  const handleMouseEnter = () => {
    setOnHoverEvent("email");
    if (!isCopyEmail) setIsHoverEmail(true);
  };

  const handleMouseLeave = () => {
    removeOnHoverEvent();
    setIsHoverEmail(false);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Clipboard blocked or unavailable (e.g. non-HTTPS): leave the "Copy?" hint as is
      return;
    }

    setIsCopyEmail(true);
    setIsHoverEmail(false);
  };

  useEffect(() => {
    if (!isCopyEmail) return;

    const timeoutId = setTimeout(() => {
      setIsCopyEmail(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isCopyEmail]);

  return (
    <Box style={classes.boxEmail}>
      <span>Email:</span>
      <span
        id="email"
        className="txtEmail"
        onClick={copyEmail}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {EMAIL}
      </span>
      {isCopyEmail && <span className={"txtCopied"}>Copied!</span>}
      {isHoverEmail && <span className={"txtCopy"}>Copy?</span>}
    </Box>
  );
};
