import { configureStore } from "@reduxjs/toolkit";
import cursor from "./slices/cursor/index";
import camera from "./slices/camera/index";

export default configureStore({
  reducer: {
    cursor,
    camera,
  },
});
