const DEFAULT_HOVER_LINK = "home";

const readStoredHoverLink = () => {
  try {
    const stored = window.sessionStorage.getItem("hoverLink");

    if (stored === null) {
      window.sessionStorage.setItem(
        "hoverLink",
        JSON.stringify(DEFAULT_HOVER_LINK)
      );
      return DEFAULT_HOVER_LINK;
    }

    return JSON.parse(stored);
  } catch {
    return DEFAULT_HOVER_LINK;
  }
};

export { readStoredHoverLink };
