const styleHomePage = () => {
  return {
    containerTitle: {
      // backgroundColor: "green",
      padding: "4px 18px",
      position: "absolute",
      right: 0,
      bottom: 0,
      marginRight: 120,
      marginBottom: 70,
      height: "114px",
      width: "310px",
    },
    boxFullName: {
      // backgroundColor: "blue",
      padding: 0,
      margin: 0,
      position: "absolute",
      left: 0,
      marginLeft: "18px",
      marginTop: "4px"
    },
    txtFullName: {
      padding: 0,
      margin: 0,
      letterSpacing: "2px",
      fontSize: "24px",
      fontFamily: "Neue Montreal Book",
    },
    boxSubtitle: {
      // backgroundColor: "#222",
      width: "310px",
      height: "60px",
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      justifyContent: "space-evenly",
      left: 0,
      bottom: 0,
      marginBottom: 30,
      marginLeft: 18,
      fontSize: "15px",
      fontFamily: "Neue Montreal Thin",
      letterSpacing: "1px"
    },
    boxRole: {
      // backgroundColor: "teal",
    },
    boxCompany: {
      // backgroundColor: "blue",
    },
    linkCompany:{
      textDecoration: "none",
      color: "#d9d9d9",
      fontFamily: "Neue Montreal Medium",
      cursor: "none",
      fontWeight: "bold"
    }
  }
}

export { styleHomePage };
