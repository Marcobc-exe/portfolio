import { useCursor } from "../context/CursorContext";

const useCursorEvents = () => {
  const {
    event,
    selected,
    setOnHoverEvent,
    removeOnHoverEvent,
  } = useCursor();

  return {
    event,
    selected,
    setOnHoverEvent,
    removeOnHoverEvent,
  };
};

export default useCursorEvents;
