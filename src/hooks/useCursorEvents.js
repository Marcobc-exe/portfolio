import { useCursor } from "../context/CursorContext";

const useCursorEvents = () => {
  const {
    event,
    selected,
    setOnHoverEvent,
    removeOnHoverEvent,
    setSelectedEvent,
  } = useCursor();

  return {
    event,
    selected,
    setOnHoverEvent,
    removeOnHoverEvent,
    setSelectedEvent,
  };
};

export default useCursorEvents;
