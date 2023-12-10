import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  event: "",
};

export const cursorSlice = createSlice({
  name: "cursor",
  initialState,
  reducers: {
    handleOnHoverEvent: (state, { payload }) => {
      state.event = payload;
    },
  },
});

export const { handleOnHoverEvent } = cursorSlice.actions;
export default cursorSlice.reducer;
