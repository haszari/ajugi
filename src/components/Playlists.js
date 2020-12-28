import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import store from "../store/store.js";

import { getApiToken } from "../store/spotify-client/selectors";
import { fetchPlaylists, setSelectedPlaylistId } from "../store/playlists";
import {
  getPlaylists,
  getSelectedPlaylistId,
} from "../store/playlists/selectors";

function Playlists() {
  const apiToken = useSelector(getApiToken);
  const playlists = useSelector(getPlaylists);
  const selectedPlaylistId = useSelector(getSelectedPlaylistId);

  // If there are no playlists, dispatch load action.
  useEffect(() => {
    if (playlists.length > 0 || !apiToken) {
      return;
    }
    store.dispatch(fetchPlaylists({ spotifyAccessToken: apiToken }));
  }, [apiToken, playlists]);

  const selectedStyle = {
    backgroundColor: "orange",
  };

  return (
    <>
      {playlists?.map((playlist) => (
        <div
          key={playlist.id}
          style={selectedPlaylistId === playlist.id ? selectedStyle : null}
          onClick={() => {
            console.log("what");
            store.dispatch(
              setSelectedPlaylistId({ selectedPlaylistId: playlist.id })
            );
          }}
        >
          {playlist.name}
        </div>
      ))}
    </>
  );
}

export default Playlists;
