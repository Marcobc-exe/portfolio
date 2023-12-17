import useCursorEvents from "./useCursorEvents";

/**
 * Handle last or first user's pathname
 * 
 * @returns {string} returns last user's pathname
 */
const useHoverLink = () => {
  const { setSelectedEvent } = useCursorEvents();
  let hoverLink = JSON.stringify("home");
  const isHoverLink = window.sessionStorage.getItem("hoverLink");

  if (isHoverLink === null) {
    window.sessionStorage.setItem("hoverLink", hoverLink);
    setSelectedEvent(hoverLink);
  } else {
    hoverLink = JSON.parse(isHoverLink);
    setSelectedEvent(hoverLink);
  }

  return { hoverLink };
};

export default useHoverLink;