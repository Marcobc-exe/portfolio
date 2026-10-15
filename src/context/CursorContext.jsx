/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { arrPaths } from "../constants/menuPaths";

const CursorContext = createContext(null);

export const CursorProvider = ({ children }) => {
  const [event, setEvent] = useState("");
  const { pathname } = useLocation();

  // The active link always follows the current route (direct URL, back/forward, clicks)
  const selected =
    arrPaths.find((arrPath) => arrPath.path === pathname)?.id ?? "home";

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

  const value = useMemo(
    () => ({
      event,
      selected,
      setOnHoverEvent,
      removeOnHoverEvent,
    }),
    [event, selected, setOnHoverEvent, removeOnHoverEvent]
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
