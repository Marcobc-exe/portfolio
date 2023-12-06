/**
 * Handle last or first user's pathname
 * 
 * @returns {string} returns last user's pathname
 */
const useHoverLink = () => {
  let hoverLink = JSON.stringify("home");
  const isHoverLink = window.sessionStorage.getItem("hoverLink");

  if (isHoverLink === null) {
    window.sessionStorage.setItem("hoverLink", hoverLink);
  } else {
    hoverLink = JSON.parse(isHoverLink);
  }

  return { hoverLink };
};

export default useHoverLink;