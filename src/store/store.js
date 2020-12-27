import { configureStore } from "@reduxjs/toolkit";

import spotifyClient from "./spotify-client";

// legacy .. maybe unused
import app from "./app/slice";

const store = configureStore({
  reducer: {
    app,
    spotifyClient,
  },
});

export default store;
