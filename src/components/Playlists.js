import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { baseUrl, spotifyFetch } from "../lib/spotify-api";

import { getApiToken } from "../store/spotify-client/selectors";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  const apiToken = useSelector(getApiToken);

  // If playlists are empty, fetch em.
  // This is basically a demo/temporary.
  useEffect(() => {
    if (playlists.length > 0 || !apiToken) {
      return;
    }

    spotifyFetch({
      spotifyAccessToken: apiToken,
      url: baseUrl + "me/playlists",
    }).then((response) => {
      setPlaylists(response?.items);
    });
  }, [apiToken, playlists, setPlaylists]);

  return (
    <>
      {playlists?.map((playlist) => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </>
  );
}

export default Playlists;
