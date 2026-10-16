import "./index.css";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Check from "@mui/icons-material/Check";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import useCursorEvents from "../../hooks/useCursorEvents";

const EMAIL = "marco.bravo.dev@gmail.com";

export const Email = () => {
  const [isCopyEmail, setIsCopyEmail] = useState(false);
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();

  const handleMouseEnter = () => {
    setOnHoverEvent("email");
  };

  const handleMouseLeave = () => {
    removeOnHoverEvent();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }

    setIsCopyEmail(true);
  };

  useEffect(() => {
    if (!isCopyEmail) return;

    const timeoutId = setTimeout(() => {
      setIsCopyEmail(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isCopyEmail]);

  return (
    <Box
      className="boxEmail"
      onClick={copyEmail}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span id="email" className="txtEmail">
        {EMAIL}
      </span>
      <span className={`emailBadge${isCopyEmail ? " isCopied" : ""}`}>
        {isCopyEmail ? (
          <Check fontSize="inherit" titleAccess="Email copied" />
        ) : (
          <ContentCopy fontSize="inherit" titleAccess="Copy email" />
        )}
      </span>
    </Box>
  );
};
