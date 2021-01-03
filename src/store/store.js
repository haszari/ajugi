import { configureStore } from "@reduxjs/toolkit";

import app from "./app";
import playlists from "./playlists";
import albums from "./albums";

const store = configureStore({
  reducer: {
    app,
    playlists,
    albums,
  },
});

export default store;
