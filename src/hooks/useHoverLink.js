import { readStoredHoverLink } from "../utils/hoverLink";

/**
 * Handle last or first user's pathname
 *
 * @returns {string} returns last user's pathname
 */
const useHoverLink = () => {
  const hoverLink = readStoredHoverLink();

  return { hoverLink };
};

export default useHoverLink;
