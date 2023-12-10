import { useEffect, useRef } from "react";
import "./index.css";
import { useSelector } from "react-redux";

const CursorPro = () => {
  const cursorRef = useRef(null);
  const { event } = useSelector((state) => state.cursor);

  useEffect(() => {
    const cursorDot = cursorRef.current;

    const mouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
      }
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [cursorRef]);

  return <div className={`cursor-dot ${event}`} ref={cursorRef} />;
};

export default CursorPro;
