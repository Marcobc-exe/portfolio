import { useDispatch } from "react-redux";
import { handleOnHoverEvent, handleSelectedEvent } from "../store/slices/cursor";

const useCursorEvents = () => {
  const dispatch = useDispatch();

  const setOnHoverEvent = () => {
    dispatch(handleOnHoverEvent("onHover"));
  };

  const removeOnHoverEvent = () => {
    dispatch(handleOnHoverEvent(""));
  };

  const setSelectedEvent = (id) => {
    dispatch(handleSelectedEvent(id));
  };

  return {
    setOnHoverEvent,
    removeOnHoverEvent,
    setSelectedEvent,
  }
}

export default useCursorEvents;