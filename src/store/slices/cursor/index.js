import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  event: "",
  selected: "",
};

export const cursorSlice = createSlice({
  name: "cursor",
  initialState,
  reducers: {
    handleOnHoverEvent: (state, { payload }) => {
      state.event = payload;
    },
    handleSelectedEvent: (state, { payload }) => {
      state.selected = payload;
    }
  },
});

export const { handleOnHoverEvent, handleSelectedEvent } = cursorSlice.actions;
export default cursorSlice.reducer;
