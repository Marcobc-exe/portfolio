import { useEffect, useRef, useState } from "react";
import "./index.css";
import { useSelector } from "react-redux";

const CursorPro = () => {
  const cursorRef = useRef(null);
  const { event, selected } = useSelector((state) => state.cursor);
  const [eventSelected, setEventSelected] = useState("");

  useEffect(() => {
    const cursorDot = cursorRef.current;

    const mouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      const linkId = e.target.id;

      if (cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
      }

      if (linkId === selected) {
        setEventSelected("onSelected")
      } else {
        setEventSelected("")
      }
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [cursorRef, selected]);

  return <div className={`cursor-dot ${event} ${eventSelected}`} ref={cursorRef} />;
};

export default CursorPro;
