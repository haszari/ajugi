import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import store from "../store/store.js";

import { getApiToken } from "../store/spotify-client/selectors";
import { fetchPlaylists } from "../store/playlists";
import { getPlaylists } from "../store/playlists/selectors";

function Playlists() {
  const apiToken = useSelector(getApiToken);
  const playlists = useSelector(getPlaylists);

  // If there are no playlists, dispatch load action.
  useEffect(() => {
    if (playlists.length > 0 || !apiToken) {
      return;
    }
    store.dispatch(fetchPlaylists({ spotifyAccessToken: apiToken }));
  }, [apiToken, playlists]);

  return (
    <>
      {playlists?.map((playlist) => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </>
  );
}

export default Playlists;
