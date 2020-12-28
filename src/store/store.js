import { configureStore } from "@reduxjs/toolkit";

import spotifyClient from "./spotify-client";
import playlists from "./playlists";

// legacy .. maybe unused
import app from "./app/slice";

const store = configureStore({
  reducer: {
    app,
    spotifyClient,
    playlists,
  },
});

export default store;
