import styled from "styled-components";
import { Link } from "react-router-dom";

const styleLayout = () => {
  return {
    layout: {
      border: "1px solid #d9d9d9",
      margin: 35,
      display: "flex",
      placeItems: "center",
      minWidth: "calc(100vw - 72px)",
      minHeight: "calc(100vh - 72px)",
    },
    containerNavbar: {
      position: "absolute",
      bottom: 0,
      marginBottom: 70,
      height: "120px",
      width: "120px",
    },
    containerLinks: {
      margin: 10,
      display: "flex",
      flexDirection: "column",
    },
    containerLink: {
      height: "24px",
      display: "flex",
      flexDirection: "row",
      position: "relative",
      left: "-5px",
      margin: "2px 0px"
    },
    containerHoverLink: {
      height: "100%",
      width: "24px",
    },
  };
};

const styleLink = (id, activedLink) => {
  return {
    textDecoration: id === activedLink ? "line-through" : "none",
  };
};

const styleHoverLink = (id, onHoverId, activedLink) => {
  if (id === onHoverId) {
    return {
      height: "7px",
      width: "7px",
      backgroundColor: onHoverId === activedLink ? "#d9d9d9" : "#242424",
      border: "1px solid #d9d9d9",
      borderRadius: "30px",
      position: "relative",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    };
  }
};

const StyledLink = styled(Link)`
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: #d9d9d9;
  font-weight: 500;
  letter-spacing: 1px;
`;

export { styleLayout, styleLink, styleHoverLink, StyledLink };
