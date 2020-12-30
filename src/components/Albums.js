import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import store from "../store/store.js";

import { fetchSongs } from "../store/albums";
import { getStatus } from "../store/albums/selectors";
import { getApiToken } from "../store/app/selectors";

function Albums() {
  const status = useSelector(getStatus);
  const spotifyAccessToken = useSelector(getApiToken);

  // Start loading songs on mount.
  useEffect(() => {
    store.dispatch(fetchSongs({ spotifyAccessToken }));
  }, [spotifyAccessToken]);

  return status === "loading"
    ? "Loading songs … please wait."
    : "Songs loaded!";
}

export default Albums;
