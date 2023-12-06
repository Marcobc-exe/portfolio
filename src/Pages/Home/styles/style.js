const styleBoxContainer = () => {
  return {
    containerNavbar: {
      backgroundColor: "green",
      position: "absolute",
      float: "left",
      bottom: 0,
      marginBottom: 36,
      height: "200px",
      width: "180px",
    },
    containerLinks: {
      display: "flex",
      flexDirection: "column",
      textDecoration: "none",
      backgroundColor: "yellow"
    }
  }
}

export { styleBoxContainer };
