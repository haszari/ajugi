import { configureStore } from "@reduxjs/toolkit";

import app from "./app";
import playlists from "./playlists";

const store = configureStore({
  reducer: {
    app,
    playlists,
  },
});

export default store;
