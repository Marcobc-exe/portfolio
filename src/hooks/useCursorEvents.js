import { useDispatch } from "react-redux";
import { handleOnHoverEvent } from "../store/slices/cursor";

const useCursorEvents = () => {
  const dispatch = useDispatch();

  const setOnHoverEvent = () => {
    dispatch(handleOnHoverEvent("onHover"));
  };

  const removeOnHoverEvent = () => {
    dispatch(handleOnHoverEvent(""));
  };

  return {
    setOnHoverEvent,
    removeOnHoverEvent,
  }
}

export default useCursorEvents;