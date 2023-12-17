import { configureStore } from "@reduxjs/toolkit";
import cursor from "./slices/cursor/index";

export default configureStore({
  reducer: {
    cursor,
  },
});
