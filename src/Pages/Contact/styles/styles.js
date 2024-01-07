const styleContactPage = () => {
  return {
    containerContact: {
      // backgroundColor: "green",
      width: "400px",
      height: "120px",
      maxHeight: "120px",
      position: "absolute",
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: 120,
    },
    boxTitleContact: {
      // backgroundColor: "blue",
      display:"flex",
      alignItems: "center",
      justifyContent: "center",
      height: "52px",
      fontFamily: "Neue Montreal Medium",
      fontSize: "20px"
    },
    txtTitleContact:{
      marginBottom: "8px",
      letterSpacing: "2px",
    },
    boxLinksContact: {
      // backgroundColor: "red",
      height: "68px",
      fontFamily: "Neue Montreal Thin",
      letterSpacing: "1px"
    },
    boxEmail: {
      // backgroundColor: "green",
      display: "flex",
      gap: "12px"
    },
    boxInternet: {
      // backgroundColor: "aqua",
      display: "flex",
      gap: "8px",
    },
    linkLinkedIn: {
      textDecoration: "none",
      color: "#d9d9d9",
      fontFamily: "Neue Montreal Medium",
      cursor: "none"
    },
    linkGitHub: {
      textDecoration: "none",
      color: "#d9d9d9",
      fontFamily: "Neue Montreal Medium",
      cursor: "none"
    }
  }
}

export { styleContactPage };