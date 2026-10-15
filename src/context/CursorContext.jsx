/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { readStoredHoverLink } from "../utils/hoverLink";

const CursorContext = createContext(null);

export const CursorProvider = ({ children }) => {
  const [event, setEvent] = useState("");
  const [selected, setSelected] = useState(readStoredHoverLink);

  const setOnHoverEvent = useCallback((element) => {
    if (element === "email") {
      setEvent("onHoverEmail");
    } else if (element === "linkCompany") {
      setEvent("onHoverCompany");
    } else {
      setEvent("onHover");
    }
  }, []);

  const removeOnHoverEvent = useCallback(() => {
    setEvent("");
  }, []);

  const setSelectedEvent = useCallback((id) => {
    setSelected(id);
  }, []);

  const value = useMemo(
    () => ({
      event,
      selected,
      setOnHoverEvent,
      removeOnHoverEvent,
      setSelectedEvent,
    }),
    [event, selected, setOnHoverEvent, removeOnHoverEvent, setSelectedEvent]
  );

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);

  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }

  return context;
};
