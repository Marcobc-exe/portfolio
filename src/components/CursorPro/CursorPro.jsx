import { useEffect, useRef, useState } from "react";
import "./index.css";
import useCursorEvents from "../../hooks/useCursorEvents";

const CursorPro = () => {
  const cursorRef = useRef(null);
  const { event, selected } = useCursorEvents();
  const [eventSelected, setEventSelected] = useState("");
  // Last value passed to setEventSelected, so mousemove only re-renders when it changes
  const eventSelectedRef = useRef("");

  useEffect(() => {
    const cursorDot = cursorRef.current;

    const mouseMove = (e) => {
      // transform (instead of left/top) moves the dot without triggering layout
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      const nextEventSelected = e.target.id === selected ? "onSelected" : "";

      if (nextEventSelected !== eventSelectedRef.current) {
        eventSelectedRef.current = nextEventSelected;
        setEventSelected(nextEventSelected);
      }
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [cursorRef, selected]);

  return (
    <div className={`cursor-dot ${event} ${eventSelected}`} ref={cursorRef} />
  );
};

export default CursorPro;
