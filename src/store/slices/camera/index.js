import { createSlice } from "@reduxjs/toolkit";
const isHoverLink = window.sessionStorage.getItem("hoverLink");

let camPosition = [];
// console.log(isHoverLink)
if (isHoverLink === '"home"') {
  camPosition = [0, 0, 22];
}

if (isHoverLink === '"work"') {
  camPosition = [0, 0, 22];
}

// eslint-disable-next-line no-unused-vars
const initialState = {
  x: camPosition[0],
  y: camPosition[1],
  z: camPosition[2],
};

export const cameraSlice = createSlice({
  name: "camera",
  initialState,
  reducers: {},
});

export default cameraSlice.reducer;
